import { db } from './offline/db';
import GlobalStyles from './style/GlobalStyles';
import React from 'react';
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
} from '@equinor/procosys-webapp-components';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { getOfflineStatus } from './offline/OfflineStatus';

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
    await navigator.serviceWorker.ready; //wait until service worker is active

    if ('serviceWorker' in navigator) {
        console.log('SERVICE WORKER ER I NAVIGATOR');
    } else {
        console.log('SERVICE WORKER ER IKKE I NAVIGATOR');
        alert('Vi har ikke navigator');
    }

    const pin = '6535';

    const isOffline = getOfflineStatus();

    //Send message to service worker about offline status
    if (isOffline) {
        navigator.serviceWorker.controller?.postMessage({
            type: 'SET_OFFLINE',
        });
        navigator.serviceWorker.controller?.postMessage({
            type: 'USER_PIN',
            data: { UserPin: pin },
        });
    } else {
        navigator.serviceWorker.controller?.postMessage({
            type: 'SET_ONLINE',
        });
    }

    //Initilize database if offline
    //if (isOffline) {
    await db.init(pin);
    //}

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

    let configurationAccessToken = '';

    if (!isOffline) {
        const isRedirecting = await authInstance.handleLogin();
        if (isRedirecting) return Promise.reject('redirecting');
        configurationAccessToken = await authInstance.getAccessToken(
            configurationScope
        );
    }

    // Get config from App Configuration
    const { appConfig, featureFlags } = await getAppConfig(
        configurationEndpoint,
        configurationAccessToken
    );

    let accessToken = '';
    if (!isOffline) {
        accessToken = await authInstance.getAccessToken(
            appConfig.procosysWebApi.scope
        );
    }

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

    return {
        authInstance,
        procosysApiInstance,
        appInsightsReactPlugin,
        appConfig,
        featureFlags,
        configurationAccessToken,
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
            configurationAccessToken,
        } = await initialize();

        render(
            <App
                authInstance={authInstance}
                procosysApiInstance={procosysApiInstance}
                appInsightsReactPlugin={appInsightsReactPlugin}
                appConfig={appConfig}
                featureFlags={featureFlags}
                configurationAccessToken={configurationAccessToken}
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
