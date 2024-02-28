import GlobalStyles from './style/GlobalStyles';
import React from 'react';
import { createRoot } from 'react-dom/client';
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
    SkeletonLoadingPage,
    StorageKey,
} from '@equinor/procosys-webapp-components';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import procosysIPOApiService from './services/procosysIPOApi';
import OfflinePin from './OfflinePin';
import {
    getOfflineProjectIdfromLocalStorage,
    getOfflineStatusfromLocalStorage,
    updateOfflineStatus,
} from './offline/OfflineStatus';
import { syncronizeOfflineUpdatesWithBackend } from './offline/syncUpdatesWithBackend';
import {
    LocalStorage,
    OfflineScopeStatus,
    OfflineStatus,
} from './typings/enums';
import hasConnectionToServer from './utils/hasConnectionToServer';
import ConfirmSync from './ConfirmSync';
import { db } from './offline/db';

const onUpdate = (registration: ServiceWorkerRegistration): void => {
    localStorage.setItem(LocalStorage.SW_UPDATE, 'true');
};

serviceWorkerRegistration.register({ onUpdate });
const container = document.getElementById('root');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
const render = (content: JSX.Element): void => {
    root.render(
        <React.StrictMode>
            <>
                <GlobalStyles />
                {content}
            </>
        </React.StrictMode>
    );
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const initialize = async () => {
    render(<LoadingPage loadingText={'Initializing service worker...'} />);
    console.log('Application is initializing');
    await navigator.serviceWorker.ready; //wait until service worker is active
    if (!('serviceWorker' in navigator)) {
        console.log('The service worker is not active.');
        alert('Service worker is not ready.');
    }

    const offline = getOfflineStatusfromLocalStorage();
    console.log('Offline status is ', offline);

    updateOfflineStatus(offline, userPin);
    // Get auth config, setup auth client and handle login
    render(<LoadingPage loadingText={'Initializing authentication...'} />);
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

    console.log('INITIALIZE 2');

    // Get config from App Configuration
    render(<LoadingPage loadingText={'Initializing app config...'} />);
    const { appConfig, featureFlags } = await getAppConfig(
        configurationEndpoint,
        configurationAccessToken
    );

    render(<LoadingPage loadingText={'Initializing access token...'} />);
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

    render(<LoadingPage loadingText={'Initializing IPO access token...'} />);
    let accessTokenIPO = '';
    if (offline != OfflineStatus.OFFLINE) {
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
};

let isSure = false;
const setIsSure = (): void => {
    isSure = true;
};

const renderApp = async (): Promise<void> => {
    //If user is offline, the rendering of the app will be stalled, until pin is provided.
    console.log('renderApp 1');
    const status = getOfflineStatusfromLocalStorage();
    console.log('renderApp 2: ' + status);
    if (status != OfflineStatus.ONLINE && userPin == '') {
        console.log('renderApp 3');
        setTimeout(renderApp, 1000);
        return;
    }

    console.log('renderApp 4: ' + status);
    if (status == OfflineStatus.CANCELLING) {
        let api = null;

        try {
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
                <SkeletonLoadingPage
                    nrOfRows={10}
                    text={
                        'Cancelling offline mode. Please do not exit the app until you have exited offline mode.'
                    }
                />
            );

            api = procosysApiInstance;
            const currentPlant = localStorage.getItem(StorageKey.PLANT);
            const currentProject = getOfflineProjectIdfromLocalStorage();

            if (!currentPlant || !currentProject) {
                throw Error(
                    'Not able to synchronize because current plant or current project was not found on local storage.'
                );
            }

            await api.putUnderPlanning(currentPlant, currentProject);
            await db.delete();
            updateOfflineStatus(OfflineStatus.ONLINE, '');

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
        } catch (error) {
            console.error('Error occured in cancellation of offline. ', error);

            let errorMessage = '';

            if (api && (await hasConnectionToServer(api))) {
                errorMessage =
                    'An error occured while cancelling offline mode. Reload this page to try again. Contact support if problem persist.';
            } else {
                errorMessage =
                    'The application is not able to connect to the server. Please check you internet connection. Reload this page to try again. Contact support if problem persist.';
            }

            render(
                <ErrorPage
                    actions={[<ReloadButton key={'reload'} />]}
                    title="Error occured while cancelling offline mode"
                    description={errorMessage}
                ></ErrorPage>
            );
        }
    }
    if (status == OfflineStatus.SYNCHING) {
        //The user has selected to finish Offline,
        //so the synchronization with backend must be started.
        //We need to go online before initialization of the application.
        let api = null;

        try {
            const {
                authInstance,
                procosysApiInstance,
                appInsightsReactPlugin,
                appConfig,
                featureFlags,
                configurationAccessToken,
                procosysIPOApiInstance,
            } = await initialize();

            api = procosysApiInstance;
            const currentPlant = localStorage.getItem(StorageKey.PLANT);
            const currentProject = getOfflineProjectIdfromLocalStorage();

            if (!currentPlant || !currentProject) {
                throw Error(
                    'Not able to synchronize because current plant or current project was not found on local storage.'
                );
            }

            const offlineBookmarks = await api.getBookmarks(
                currentPlant,
                currentProject
            );
            if (
                offlineBookmarks?.openDefinition.status ==
                OfflineScopeStatus.UNDER_PLANNING
            ) {
                render(<ConfirmSync setIsSure={setIsSure} />);

                if (isSure == false) {
                    setTimeout(renderApp, 1000);
                    return;
                }
            }

            render(
                <SkeletonLoadingPage
                    nrOfRows={10}
                    text={
                        'Synching offline changes. Please do not exit the app until the upload has finished.'
                    }
                />
            );

            await syncronizeOfflineUpdatesWithBackend(
                procosysApiInstance,
                offlineBookmarks?.openDefinition.status ==
                    OfflineScopeStatus.UNDER_PLANNING
            );
            console.log('Synchronization is done.');

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
        } catch (error) {
            console.error(
                'Error occured in synchronization with backend. ',
                error
            );

            let errorMessage = '';

            if (api && (await hasConnectionToServer(api))) {
                errorMessage =
                    'An error occured during synchronization of offline updates. Reload this page to try again. Contact support if problem persist.';
            } else {
                errorMessage =
                    'The application is not able to connect to the server. Please check you internet connection. Reload this page to try again. Contact support if problem persist.';
            }

            render(
                <ErrorPage
                    actions={[<ReloadButton key={'reload'} />]}
                    title="Error occured during synchronization"
                    description={errorMessage}
                ></ErrorPage>
            );
        }
    } else {
        //We are either in online or offline mode, and will render the application
        console.log('renderApp  7: ');

        const {
            authInstance,
            procosysApiInstance,
            appInsightsReactPlugin,
            appConfig,
            featureFlags,
            configurationAccessToken,
            procosysIPOApiInstance,
        } = await initialize();
        console.log('renderApp 8: ');

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
    console.log('--------0');
    console.log('--------1');

    await navigator.serviceWorker.ready; //wait until service worker is active
    console.log('-----------2');
    try {
        const status = getOfflineStatusfromLocalStorage();
        console.log('-----------3');
        if (status != OfflineStatus.ONLINE) {
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
