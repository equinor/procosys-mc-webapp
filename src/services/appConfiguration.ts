/* eslint-disable @typescript-eslint/explicit-function-return-type */
import axios from 'axios';

const Settings = require('../settings.json');

export type AuthSettings = {
    clientId: string;
    authority: string;
    scopes: string[];
};

type ProcosysApiSettings = {
    baseUrl: string;
    apiVersion: string;
    scope: string[];
};

type AppInsightsConfig = {
    instrumentationKey: string;
};

type AuthConfigResponse = {
    clientId: string;
    authority: string;
    scopes: string[];
    configurationScope: string[];
    configurationEndpoint: string;
};

type AppConfigResponse = {
    configuration: {
        procosysWebApi: ProcosysApiSettings;
        appInsights: AppInsightsConfig;
    };
};

export const getAuthConfig = async () => {
    const { data } = await axios.get<AuthConfigResponse>(
        Settings.authSettingsEndpoint
    );
    // Todo: TypeGuard authsettings
    const clientSettings = {
        auth: {
            clientId: data.clientId,
            authority: data.authority,
            redirectUri: window.location.origin,
        },
    };
    const scopes = data.scopes;
    const configurationScope = data.configurationScope;
    const configurationEndpoint = data.configurationEndpoint;

    return {
        clientSettings,
        scopes,
        configurationScope,
        configurationEndpoint,
    };
};

export const getAppConfig = async (endpoint: string, accessToken: string) => {
    const { data } = await axios.get<AppConfigResponse>(endpoint, {
        headers: {
            Authorization: 'Bearer ' + accessToken,
        },
    });
    const procosysApiConfig = data.configuration
        .procosysWebApi as ProcosysApiSettings;
    const appInsightsConfig = data.configuration
        .appInsights as AppInsightsConfig;
    return { procosysApiConfig, appInsightsConfig };
};
