import React, { Dispatch, SetStateAction } from 'react';
import { MemoryRouter } from 'react-router-dom';
import PlantContext from '../contexts/PlantContext';
import McAppContext, { AsyncStatus } from '../contexts/McAppContext';
import * as Msal from '@azure/msal-browser';
import { Plant, Project } from '../services/apiTypes';
import baseApiService from '../services/baseApi';
import procosysApiService, {
    ProcosysApiService,
} from '../services/procosysApi';
import authService from '../services/__mocks__/authService';
import { testProjects, testPlants, dummyPermissions } from './dummyData';
import { IAuthService } from '../services/authService';
import { baseURL } from './setupServer';
import { AppConfig, FeatureFlags } from '../services/appConfiguration';

const client = new Msal.PublicClientApplication({
    auth: { clientId: 'testId', authority: 'testAuthority' },
});

const dummyAppConfig: AppConfig = {
    procosysWebApi: {
        baseUrl: 'testUrl',
        scope: [''],
        apiVersion: '',
    },
    appInsights: {
        instrumentationKey: '',
    },
    ocrFunctionEndpoint: 'https://dummy-org-endpoint.com',
};

const dummyFeatureFlags: FeatureFlags = {
    mcAppIsEnabled: true,
};

const authInstance = authService({ MSAL: client, scopes: ['testScope'] });
const baseApiInstance = baseApiService({
    authInstance,
    baseURL: baseURL,
    scope: ['testscope'],
});
const procosysApiInstance = procosysApiService({
    axios: baseApiInstance,
    apiVersion: 'dummy-version',
});

type WithMcAppContextProps = {
    Component: JSX.Element;
    asyncStatus?: AsyncStatus;
    plants?: Plant[];
    auth?: IAuthService;
    api?: ProcosysApiService;
    offlineState?: boolean;
    setOfflineState: Dispatch<SetStateAction<boolean>>;
};

export const withMcAppContext = ({
    Component,
    asyncStatus = AsyncStatus.SUCCESS,
    plants = testPlants,
    auth = authInstance,
    api = procosysApiInstance,
    offlineState = false,
    setOfflineState,
}: WithMcAppContextProps): JSX.Element => {
    return (
        <MemoryRouter initialEntries={['/test/sub/directory']}>
            <McAppContext.Provider
                value={{
                    availablePlants: plants,
                    fetchPlantsStatus: asyncStatus,
                    auth: auth,
                    api: api,
                    appConfig: dummyAppConfig,
                    featureFlags: dummyFeatureFlags,
                    offlineState: offlineState,
                    setOfflineState: setOfflineState,
                }}
            >
                {Component}
            </McAppContext.Provider>
        </MemoryRouter>
    );
};

type WithPlantContextProps = {
    Component: JSX.Element;
    fetchProjectsAndPermissionsStatus?: AsyncStatus;
    permissions?: string[];
    currentPlant?: Plant | undefined;
    availableProjects?: Project[] | null;
    currentProject?: Project | undefined;
    setCurrentProject?: (project: Project) => void;
    offlineState?: boolean;
    setOfflineState: Dispatch<SetStateAction<boolean>>;
};

export const withPlantContext = ({
    fetchProjectsAndPermissionsStatus = AsyncStatus.SUCCESS,
    availableProjects = testProjects,
    currentPlant = testPlants[1],
    currentProject = testProjects[1],
    permissions = dummyPermissions,
    Component,
    offlineState = false,
    setOfflineState,
}: WithPlantContextProps): JSX.Element => {
    return withMcAppContext({
        Component: (
            <PlantContext.Provider
                value={{
                    fetchProjectsAndPermissionsStatus:
                        fetchProjectsAndPermissionsStatus,
                    permissions: permissions,
                    currentPlant: currentPlant,
                    availableProjects: availableProjects,
                    currentProject: currentProject,
                }}
            >
                {Component}
            </PlantContext.Provider>
        ),
        offlineState: offlineState,
        setOfflineState: setOfflineState,
    });
};
