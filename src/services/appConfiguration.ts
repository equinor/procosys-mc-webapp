/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { IEntity } from '@equinor/procosys-webapp-components';
import removeBaseUrlFromUrl from '../utils/removeBaseUrlFromUrl';
import { handleFetchGet } from '../offline/handleFetchEvents';

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
    appInsights: AppInsightsConfig;
    ocrFunctionEndpoint: string;
    ipoApi: ProcosysApiSettings;
};

export const appConfig: any = {
    ocrFunctionEndpoint: process.env.REACT_APP_OCR_FUNCTION_ENDPOINT,
    ipoApi: {
        baseUrl: process.env.REACT_APP_IPO_API_BASE_URL,
        apiVersion: process.env.REACT_APP_API_VERSION,
        scope: [process.env.REACT_APP_IPO_API_SCOPE],
    },
    auth: {
        clientId: process.env.REACT_APP_AUTH_CLIENT_ID,
        authority: process.env.REACT_APP_AUTH_AUTHORITY,
        configurationEndpoint: process.env.REACT_APP_AUTH_CONFIG_ENDPOINT,
        scope: [process.env.REACT_APP_AUTH_SCOPE],
        configurationScope: [process.env.REACT_APP_AUTH_CONFIG_SCOPE],
    },
    appInsights: {
        instrumentationKey:
            process.env.REACT_APP_APP_INSIGHTS_INSTRUMENTATION_KEY,
    },
};

export const featureFlags = {
    offlineFunctionalityIsEnabled:
        process.env.REACT_APP_FEATURE_OFFLINE_ENABLED === 'false',
    mcAppIsEnabled: process.env.REACT_APP_FEATURE_MC_APP_ENABLED === 'true',
};
