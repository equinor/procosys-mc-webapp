import GlobalStyles from './style/GlobalStyles';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import authService from './services/authService';
import * as MSAL from '@azure/msal-browser';
import procosysApiService from './services/procosysApi';
import { getAppConfig, getAuthConfig } from './services/appConfiguration';
import initializeAppInsights from './services/appInsights';
import {
    ErrorPage,
    ReloadButton,
    LoadingPage,
    CompletionStatus,
} from '@equinor/procosys-webapp-components';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { StatusRepository } from './database/StatusRepository';
import buildOfflineScope from './database/buildOfflineScope';
import { Bookmarks, McPkgPreview } from './services/apiTypes';
import { useWorker } from '@koale/useworker';

serviceWorkerRegistration.register();

const render = (content: JSX.Element): void => {
    ReactDOM.render(
        <React.StrictMode>
            <>
                <GlobalStyles />
                {content}
            </>
        </React.StrictMode>,
        document.getElementById('root')
    );
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const initialize = async () => {
    // Get auth config, setup auth client and handle login
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

    const accessToken = await authInstance.getAccessToken(
        appConfig.procosysWebApi.scope
    );

    const procosysApiInstance = procosysApiService(
        {
            baseURL: appConfig.procosysWebApi.baseUrl,
            apiVersion: appConfig.procosysWebApi.apiVersion,
        },
        accessToken
    );

    const { appInsightsReactPlugin } = initializeAppInsights(
        appConfig.appInsights.instrumentationKey
    );

    //Testkode som vi vil ha i den nye 'offline' siden.
    //---------------------------------------------------------
    //Jeg kaller api.getOfflineScope, og får:

    const mcpkg: McPkgPreview = {
        id: 17712984,
        mcPkgNo: '26023-E026',
        description: 'hallo',
        status: CompletionStatus.OK,
        commPkgNo: '',
        phaseCode: '',
        phaseDescription: '',
        responsibleCode: '',
        responsibleDescription: '',
        commissioningHandoverStatus: '',
        operationHandoverStatus: '',
    };

    const bookmarks: Bookmarks = {
        Id: '1234',
        plantId: 'HEIMDAL',
        projectId: '21684993',
        McPkg: [mcpkg],
        Tag: [],
        Wo: [],
        Po: [],
    };

    //const [buildOfflineScopeWorker] = useWorker(buildOfflineScope);
    //buildOfflineScopeWorker(procosysApiInstance, bookmarks);
    buildOfflineScope(procosysApiInstance, bookmarks);

    return {
        authInstance,
        procosysApiInstance,
        appInsightsReactPlugin,
        appConfig,
        featureFlags,
    };
};

(async (): Promise<void> => {
    render(<LoadingPage loadingText={'Initializing...'} />);
    try {
        const {
            authInstance,
            procosysApiInstance,
            appInsightsReactPlugin,
            appConfig,
            featureFlags,
        } = await initialize();

        render(
            <App
                authInstance={authInstance}
                procosysApiInstance={procosysApiInstance}
                appInsightsReactPlugin={appInsightsReactPlugin}
                appConfig={appConfig}
                featureFlags={featureFlags}
            />
        );
    } catch (error) {
        console.log(error);
        if (error === 'redirecting') {
            render(<LoadingPage loadingText={'Redirecting to login...'} />);
        } else {
            render(
                <ErrorPage
                    title="Unable to initialize app"
                    description="Check your connection or reload this page and try again. If problem persists, contact customer support"
                    actions={[<ReloadButton key={'reload'} />]}
                />
            );
        }
    }
})();
