import { Button } from '@equinor/eds-core-react';
import React, { ReactNode, useEffect, useState } from 'react';
import {
    ErrorPage,
    ReloadButton,
    LoadingPage,
} from '@equinor/procosys-webapp-components';
import { Plant } from '../services/apiTypes';
import { AppConfig, FeatureFlags } from '../services/appConfiguration';
import { IAuthService } from '../services/authService';
import { ProcosysApiService } from '../services/procosysApi';
import { StatusRepository } from '../offline/StatusRepository';
import { ProcosysIPOApiService } from '../services/procosysIPOApi';

type McAppContextProps = {
    availablePlants: Plant[];
    fetchPlantsStatus: AsyncStatus;
    api: ProcosysApiService;
    auth: IAuthService;
    appConfig: AppConfig;
    offlineState: boolean;
    setOfflineState: (offlineState: boolean) => Promise<void>;
    featureFlags: FeatureFlags;
    configurationAccessToken: string;
    ipoApi: ProcosysIPOApiService;
};

export enum AsyncStatus {
    INACTIVE,
    LOADING,
    SUCCESS,
    ERROR,
    EMPTY_RESPONSE,
}

const McAppContext = React.createContext({} as McAppContextProps);

type McAppContextProviderProps = {
    children: ReactNode;
    auth: IAuthService;
    api: ProcosysApiService;
    appConfig: AppConfig;
    featureFlags: FeatureFlags;
    configurationAccessToken: string;
    ipoApi: ProcosysIPOApiService;
};

export const McAppContextProvider: React.FC<McAppContextProviderProps> = ({
    children,
    auth,
    api,
    appConfig,
    featureFlags,
    configurationAccessToken,
    ipoApi,
}: McAppContextProviderProps) => {
    const [availablePlants, setAvailablePlants] = useState<Plant[]>([]);
    const [fetchPlantsStatus, setFetchPlantsStatus] = useState<AsyncStatus>(
        AsyncStatus.LOADING
    );

    const [offlineState, setOfflineStateSync] = useState(false);
    const statusRepository = new StatusRepository();

    const setOfflineState = async (offlineState: boolean): Promise<void> => {
        await statusRepository.updateStatus(offlineState);
        setOfflineStateSync(offlineState);
    };

    useEffect(() => {
        const asyncFunction = async (): Promise<void> => {
            const status = await statusRepository.getStatus();
            if (status) {
                setOfflineStateSync(status.status);
            } else {
                await statusRepository.addOfflineStatus(false);
                setOfflineStateSync(false);
            }
        };
        asyncFunction();
    }, []);

    useEffect(() => {
        (async (): Promise<void> => {
            setFetchPlantsStatus(AsyncStatus.LOADING);
            try {
                const plantsFromApi = await api.getPlants();
                setAvailablePlants(plantsFromApi);
                setFetchPlantsStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                setFetchPlantsStatus(AsyncStatus.ERROR);
            }
        })();
    }, [api]);

    if (fetchPlantsStatus === AsyncStatus.LOADING) {
        return <LoadingPage loadingText={'Loading available plants'} />;
    }
    if (fetchPlantsStatus === AsyncStatus.ERROR) {
        return (
            <>
                <ErrorPage
                    actions={[
                        <Button key={'signOut'} onClick={auth.logout}>
                            Sign out
                        </Button>,
                        <ReloadButton key={'reload'} />,
                    ]}
                    title="Error: Could not load plants"
                    description="We were unable to get a list of available plants. Please check your connection, sign in with a different user or refresh this page."
                ></ErrorPage>
            </>
        );
    }
    return (
        <McAppContext.Provider
            value={{
                fetchPlantsStatus,
                availablePlants,
                api,
                auth,
                appConfig,
                offlineState,
                setOfflineState,
                featureFlags,
                configurationAccessToken,
                ipoApi,
            }}
        >
            {children}
        </McAppContext.Provider>
    );
};

export default McAppContext;
