import {
    getAppConfig,
    getAuthConfig,
} from '../../../../src/services/appConfiguration';
import { expect } from 'chai';
import 'chai/register-should';
import authService from '../../../../src/services/authService';
import * as MSAL from '@azure/msal-browser';
import baseApiService from '../../../../src/services/baseApi';
import procosysApiService from '../../../../src/services/procosysApi';

describe('Given a HttpService', async () => {
    const {
        clientSettings,
        scopes,
        configurationScope,
        configurationEndpoint,
    } = await getAuthConfig();

    const authClient = new MSAL.PublicClientApplication(clientSettings);

    const authInstance = authService({
        MSAL: authClient,
        scopes: scopes,
    });

    const isRedirecting = await authInstance.handleLogin();
    if (isRedirecting) return Promise.reject('redirecting');

    // Get config from App Configuration
    const configurationAccessToken = await authInstance.getAccessToken(
        configurationScope
    );

    const { appConfig, featureFlags } = await getAppConfig(
        configurationEndpoint,
        configurationAccessToken
    );

    const baseApiInstance = baseApiService({
        authInstance,
        baseURL: appConfig.procosysWebApi.baseUrl,
        scope: appConfig.procosysWebApi.scope,
    });

    const procosysApiInstance = procosysApiService({
        axios: baseApiInstance,
        apiVersion: appConfig.procosysWebApi.apiVersion,
    });

    it('should be able to get a list of plants', async () => {
        const plants = await procosysApiInstance.getPlants();
        expect(plants).to.be.an('array');
    });

    it('test 2', () => {
        expect(true).to.be.true;
    });
});
