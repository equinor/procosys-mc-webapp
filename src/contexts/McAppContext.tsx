import { Button } from '@equinor/eds-core-react';
import React, { ReactNode, useEffect, useState } from 'react';
import {
    ErrorPage,
    ReloadButton,
    LoadingPage,
    AsyncStatus,
} from '@equinor/procosys-webapp-components';
import { Plant } from '../services/apiTypes';
import { AppConfig, FeatureFlags } from '../services/appConfiguration';
import { IAuthService } from '../services/authService';
import { ProcosysApiService } from '../services/procosysApi';
import { ProcosysIPOApiService } from '../services/procosysIPOApi';
import { CompletionApiService } from '../services/completionApi';
import { getOfflineStatusfromLocalStorage } from '../offline/OfflineStatus';
import { OfflineStatus } from '../typings/enums';
import { AxiosInstance } from 'axios';

type McAppContextProps = {
    availablePlants: Plant[];
    fetchPlantsStatus: AsyncStatus;
    api: ProcosysApiService;
    completionApi: CompletionApiService;
    completionBaseApiInstance: AxiosInstance;
    auth: IAuthService;
    appConfig: AppConfig;
    offlineState: OfflineStatus;
    setOfflineState: React.Dispatch<React.SetStateAction<OfflineStatus>>;
    featureFlags: FeatureFlags;
    configurationAccessToken: string;
    ipoApi: ProcosysIPOApiService;
};

const McAppContext = React.createContext({} as McAppContextProps);

type McAppContextProviderProps = {
    children: ReactNode;
    auth: IAuthService;
    api: ProcosysApiService;
    appConfig: AppConfig;
    featureFlags: FeatureFlags;
    configurationAccessToken: string;
    ipoApi: ProcosysIPOApiService;
    completionApi: CompletionApiService;
    completionBaseApiInstance: AxiosInstance;
};

export const McAppContextProvider: React.FC<McAppContextProviderProps> = ({
    children,
    auth,
    api,
    appConfig,
    featureFlags,
    configurationAccessToken,
    ipoApi,
    completionApi,
    completionBaseApiInstance,
}: McAppContextProviderProps) => {
    const [availablePlants, setAvailablePlants] = useState<Plant[]>([]);
    const [fetchPlantsStatus, setFetchPlantsStatus] = useState<AsyncStatus>(
        AsyncStatus.LOADING
    );

    const [offlineState, setOfflineState] = useState<OfflineStatus>(
        OfflineStatus.ONLINE
    );

    useEffect(() => {
        const offlineStatus = getOfflineStatusfromLocalStorage();
        setOfflineState(offlineStatus);
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
                completionApi,
                completionBaseApiInstance,
            }}
        >
            {children}
        </McAppContext.Provider>
    );
};

export default McAppContext;
