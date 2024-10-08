import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import PlantContext from '../contexts/PlantContext';
import McAppContext from '../contexts/McAppContext';
import * as Msal from '@azure/msal-browser';
import { Plant, Project } from '../services/apiTypes';
import procosysApiService, {
    ProcosysApiService,
} from '../services/procosysApi';
import authService from '../services/__mocks__/authService';
import { testProjects, testPlants, dummyPermissions } from './dummyData';
import { IAuthService } from '../services/authService';
import { baseURL } from './setupServer';
import { AppConfig, FeatureFlags } from '../services/appConfiguration';
import procosysIPOApiService, {
    ProcosysIPOApiService,
} from '../services/procosysIPOApi';
import { OfflineStatus } from '../typings/enums';
import { AsyncStatus } from '@equinor/procosys-webapp-components';
import completionApiService, {
    CompletionApiService,
} from '../services/completionApi';
import axios, { AxiosInstance } from 'axios';

const client = new Msal.PublicClientApplication({
    auth: { clientId: 'testId', authority: 'testAuthority' },
});

const dummyAppConfig: AppConfig = {
    appInsights: {
        instrumentationKey: '',
    },
    ocrFunctionEndpoint: 'https://dummy-org-endpoint.com',
    ipoApi: {
        baseUrl: 'testUrl',
        apiVersion: '',
        scope: [''],
    },
};

const dummyFeatureFlags: FeatureFlags = {
    mcAppIsEnabled: true,
    offlineFunctionalityIsEnabled: false,
};

const authInstance = authService({ MSAL: client, scopes: ['testScope'] });

const procosysApiInstance = procosysApiService(
    {
        baseURL: baseURL,
        apiVersion: '&dummy-version',
    },
    'dummy-bearer-token'
);
const axiosInstance: AxiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        Authorization: 'Bearer dummy-bearer-token',
    },
});

const completionApiInstance = completionApiService({ axios: axiosInstance });

const ipoApiInstance = procosysIPOApiService(
    {
        baseURL: baseURL,
    },
    'dummy-bearer-token'
);

type WithMcAppContextProps = {
    Component: JSX.Element;
    asyncStatus?: AsyncStatus;
    plants?: Plant[];
    auth?: IAuthService;
    api?: ProcosysApiService;
    completionApi?: CompletionApiService;
    completionBaseApiInstance?: AxiosInstance;
    ipoApi?: ProcosysIPOApiService;
    offlineState?: OfflineStatus;
    setOfflineState: React.Dispatch<React.SetStateAction<OfflineStatus>>;
    useTestColorIfOnTest?: boolean;
};

export const withMcAppContext = ({
    Component,
    asyncStatus = AsyncStatus.SUCCESS,
    plants = testPlants,
    auth = authInstance,
    api = procosysApiInstance,
    completionApi = completionApiInstance,
    completionBaseApiInstance = axiosInstance,
    ipoApi = ipoApiInstance,
    offlineState = OfflineStatus.ONLINE,
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
                    ipoApi: ipoApi,
                    completionApi: completionApi,
                    completionBaseApiInstance: completionBaseApiInstance,
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
    offlineState?: OfflineStatus;
    setOfflineState: React.Dispatch<React.SetStateAction<OfflineStatus>>;
};

export const withPlantContext = ({
    fetchProjectsAndPermissionsStatus = AsyncStatus.SUCCESS,
    availableProjects = testProjects,
    currentPlant = testPlants[1],
    currentProject = testProjects[1],
    permissions = dummyPermissions,
    Component,
    offlineState = OfflineStatus.ONLINE,
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
