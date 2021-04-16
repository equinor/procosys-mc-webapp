import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import PlantContext from '../contexts/PlantContext';
import CommAppContext, { AsyncStatus } from '../contexts/CommAppContext';
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

const client = new Msal.PublicClientApplication({
    auth: { clientId: 'testId', authority: 'testAuthority' },
});

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

type WithCommAppContextProps = {
    Component: JSX.Element;
    asyncStatus?: AsyncStatus;
    plants?: Plant[];
    auth?: IAuthService;
    api?: ProcosysApiService;
};

export const withCommAppContext = ({
    Component,
    asyncStatus = AsyncStatus.SUCCESS,
    plants = testPlants,
    auth = authInstance,
    api = procosysApiInstance,
}: WithCommAppContextProps): JSX.Element => {
    return (
        <MemoryRouter initialEntries={['/test/sub/directory']}>
            <CommAppContext.Provider
                value={{
                    availablePlants: plants,
                    fetchPlantsStatus: asyncStatus,
                    auth: auth,
                    api: api,
                }}
            >
                {Component}
            </CommAppContext.Provider>
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
};

export const withPlantContext = ({
    fetchProjectsAndPermissionsStatus = AsyncStatus.SUCCESS,
    availableProjects = testProjects,
    currentPlant = testPlants[1],
    currentProject = testProjects[1],
    permissions = dummyPermissions,
    Component,
}: WithPlantContextProps): JSX.Element => {
    return withCommAppContext({
        Component: (
            <PlantContext.Provider
                value={{
                    fetchProjectsAndPermissionsStatus: fetchProjectsAndPermissionsStatus,
                    permissions: permissions,
                    currentPlant: currentPlant,
                    availableProjects: availableProjects,
                    currentProject: currentProject,
                }}
            >
                {Component}
            </PlantContext.Provider>
        ),
    });
};
