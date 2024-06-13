/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { IEntity } from '@equinor/procosys-webapp-components';
import removeBaseUrlFromUrl from '../utils/removeBaseUrlFromUrl';
import { handleFetchGet } from '../offline/handleFetchEvents';

const Settings = require('../settings.json');

export type AuthSettings = {
    clientId: string;
    authority: string;
    scopes: string[];
};

export type ProcosysApiSettings = {
    baseUrl: string;
    apiVersion: string;
    scope: string[];
};

type AppInsightsConfig = {
    instrumentationKey: string;
};

export type AuthConfigResponse = {
    clientId: string;
    authority: string;
    scopes: string[];
    configurationScope: string[];
    configurationEndpoint: string;
};

export type FeatureFlags = {
    mcAppIsEnabled: boolean;
    offlineFunctionalityIsEnabled: boolean;
};

export type AppConfig = {
    procosysWebApi: ProcosysApiSettings;
    appInsights: AppInsightsConfig;
    ocrFunctionEndpoint: string;
    ipoApi: ProcosysApiSettings;
};
