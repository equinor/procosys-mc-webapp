import { OfflineContentRepository } from '../database/OfflineContentRepository';
import { StatusRepository } from '../database/StatusRepository';

/* eslint-disable @typescript-eslint/explicit-function-return-type */

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
};

export type AppConfig = {
    procosysWebApi: ProcosysApiSettings;
    appInsights: AppInsightsConfig;
    ocrFunctionEndpoint: string;
};

type AppConfigResponse = {
    configuration: AppConfig;
    featureFlags: FeatureFlags;
};

const offlineContentRepository = new OfflineContentRepository();

/**
 * Fetch auth config
 * @param callbackFunc  This function is used to create offline scope
 */
export const fetchAuthConfig = async (
    callbackFunc: any
): Promise<AuthConfigResponse> => {
    const statusRepository = new StatusRepository();
    const statusObj = await statusRepository.getStatus();
    if (statusObj && statusObj.status) {
        const entity = await offlineContentRepository.getByApiPath(
            Settings.authSettingsEndpoint
        );
        if (entity) {
            //return object from database instead of doing a fetch
            return entity.responseObj as AuthConfigResponse;
        } else {
            console.error(
                'Offline-mode. Entity for given url is not found in local database',
                Settings.authSettingsEndpoint
            );
        }
    }

    const data = await fetch(Settings.authSettingsEndpoint);
    const authConfigResp: AuthConfigResponse = await data.json();
    if (callbackFunc != null) {
        callbackFunc(authConfigResp, Settings.authSettingsEndpoint);
    }
    return authConfigResp;
};

export const getAuthConfig = async () => {
    const authConfigResp = await fetchAuthConfig(null);

    // Todo: TypeGuard authsettings
    const clientSettings = {
        auth: {
            clientId: authConfigResp.clientId,
            authority: authConfigResp.authority,
            redirectUri: window.location.origin + '/mc',
        },
    };
    const scopes = authConfigResp.scopes;
    const configurationScope = authConfigResp.configurationScope;
    const configurationEndpoint = authConfigResp.configurationEndpoint;

    return {
        clientSettings,
        scopes,
        configurationScope,
        configurationEndpoint,
    };
};

export const fetchAppConfig = async (
    endpoint: string,
    accessToken: string
): Promise<AppConfigResponse> => {
    const data = await fetch(endpoint, {
        headers: {
            Authorization: 'Bearer ' + accessToken,
        },
    });

    return await data.json();
};

export const getAppConfig = async (endpoint: string, accessToken: string) => {
    const appConfigResponse = await fetchAppConfig(endpoint, accessToken);

    const appConfig: AppConfig = appConfigResponse.configuration;
    const featureFlags: FeatureFlags = appConfigResponse.featureFlags;
    return { appConfig, featureFlags };
};
