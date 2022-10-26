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
    ipoApi: ProcosysApiSettings;
};

type AppConfigResponse = {
    configuration: AppConfig;
    featureFlags: FeatureFlags;
};

/**
 * Fetch auth config
 * @param callbackFunc  This function is used to create offline scope
 */
export const fetchAuthConfig = async (
    callbackFunc?: any
): Promise<AuthConfigResponse> => {
    const data = await fetch(Settings.authSettingsEndpoint);
    const authConfigResp: AuthConfigResponse = await data.json();
    if (callbackFunc) {
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
    accessToken: string,
    callbackFunc?: any
): Promise<AppConfigResponse> => {
    const data = await fetch(endpoint, {
        headers: {
            Authorization: 'Bearer ' + accessToken,
        },
    });
    const resp = await data.json();

    if (callbackFunc) {
        callbackFunc(resp, endpoint);
    }

    return resp;
};

export const getAppConfig = async (endpoint: string, accessToken: string) => {
    const appConfigResponse = await fetchAppConfig(endpoint, accessToken);

    const appConfig: AppConfig = appConfigResponse.configuration;
    const featureFlags: FeatureFlags = appConfigResponse.featureFlags;
    return { appConfig, featureFlags };
};
