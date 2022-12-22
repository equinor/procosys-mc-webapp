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
import procosysIPOApiService from './services/procosysIPOApi';
import OfflinePin from './OfflinePin';
import {
    getOfflineStatusfromLocalStorage,
    updateOfflineStatus,
} from './offline/OfflineStatus';
import { syncronizeOfflineUpdatesWithBackend } from './offline/syncUpdatesWithBackend';
import { db } from './offline/db';
import { OfflineStatus } from './typings/enums';

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
    console.log('Application is initializing...5');
    await navigator.serviceWorker.ready; //wait until service worker is active
    if (!('serviceWorker' in navigator)) {
        console.log('The service worker is not active.');
        alert('Service worker is not ready.');
    }

    const offline = getOfflineStatusfromLocalStorage();
    console.log('getting offline state in init ', offline);

    updateOfflineStatus(offline, userPin);

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

    if (offline != OfflineStatus.OFFLINE) {
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
    if (offline != OfflineStatus.OFFLINE) {
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

    let accessTokenIPO = '';
    if (!offline) {
        accessTokenIPO = await authInstance.getAccessToken(
            appConfig.ipoApi.scope
        );
    }
    const procosysIPOApiInstance = procosysIPOApiService(
        {
            baseURL: appConfig.ipoApi.baseUrl,
        },
        accessTokenIPO
    );

    const { appInsightsReactPlugin } = initializeAppInsights(
        appConfig.appInsights.instrumentationKey
    );
    console.log('Initializing done.');

    return {
        authInstance,
        procosysApiInstance,
        appInsightsReactPlugin,
        appConfig,
        featureFlags,
        configurationAccessToken,
        procosysIPOApiInstance,
    };
};

let userPin = '';
const setUserPin = (pin: string): void => {
    userPin = pin;
    console.log(userPin);
};

const renderApp = async (): Promise<void> => {
    //If user is offline, the rendering of the app will be stalled, until pin is provided.
    const status = getOfflineStatusfromLocalStorage();
    console.log('render app with pin ', userPin);
    if (status != OfflineStatus.ONLINE && userPin == '') {
        setTimeout(renderApp, 1000);
        return;
    }

    if (status == OfflineStatus.SYNCHING) {
        console.log('status == sync');
        //The user has selected to finish Offline,
        //so the synchronization with backend must be started.
        //We need to go online before initialization of the application.

        const {
            authInstance,
            procosysApiInstance,
            appInsightsReactPlugin,
            appConfig,
            featureFlags,
            configurationAccessToken,
            procosysIPOApiInstance,
        } = await initialize();

        try {
            await syncronizeOfflineUpdatesWithBackend(procosysApiInstance);
            await db.delete();
        } catch (error) {
            console.log(
                'Error occured in synchronization with backend. ',
                error
            );
            throw Error('Error occured in synchronization with backend.');
            //todo: hva bør vi gjøre her?
        }

        render(
            <App
                authInstance={authInstance}
                procosysApiInstance={procosysApiInstance}
                appInsightsReactPlugin={appInsightsReactPlugin}
                appConfig={appConfig}
                featureFlags={featureFlags}
                configurationAccessToken={configurationAccessToken}
                procosysIPOApiInstance={procosysIPOApiInstance}
            />
        );
    } else {
        console.log('state not sync');
        //We are either in online or offline mode, and will render the application
        const {
            authInstance,
            procosysApiInstance,
            appInsightsReactPlugin,
            appConfig,
            featureFlags,
            configurationAccessToken,
            procosysIPOApiInstance,
        } = await initialize();

        render(
            <App
                authInstance={authInstance}
                procosysApiInstance={procosysApiInstance}
                appInsightsReactPlugin={appInsightsReactPlugin}
                appConfig={appConfig}
                featureFlags={featureFlags}
                configurationAccessToken={configurationAccessToken}
                procosysIPOApiInstance={procosysIPOApiInstance}
            />
        );
    }
};

(async (): Promise<void> => {
    render(<LoadingPage loadingText={'Initializing...'} />);
    await navigator.serviceWorker.ready; //wait until service worker is active
    try {
        console.log('getting offline status');
        const status = getOfflineStatusfromLocalStorage();
        if (
            status == OfflineStatus.OFFLINE ||
            status == OfflineStatus.SYNCHING
        ) {
            render(<OfflinePin setUserPin={setUserPin} />);
        }
        renderApp();
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
