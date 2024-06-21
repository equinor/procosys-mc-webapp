import GlobalStyles from './style/GlobalStyles';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import authService from './services/authService';
import * as MSAL from '@azure/msal-browser';
import procosysApiService from './services/procosysApi';
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
import completionApiService from './services/completionApi';
import baseIPOApiService from './services/baseIPOApi';
import { appConfig, featureFlags } from './services/appConfiguration';

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
            <GlobalStyles />
            {content}
        </React.StrictMode>
    );
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const initialize = async () => {
    render(<LoadingPage loadingText={'Initializing service worker...'} />);
    console.log('Application is initializing');
    //await navigator.serviceWorker.ready; //wait until service worker is active
    if (!('serviceWorker' in navigator)) {
        console.log('The service worker is not active.');
        alert('Service worker is not ready.');
    }

    const offline = getOfflineStatusfromLocalStorage();
    console.log('Offline status is ', offline);

    updateOfflineStatus(offline, userPin);
    // Get auth config, setup auth client and handle login
    render(<LoadingPage loadingText={'Initializing authentication...'} />);

    const authClient = new MSAL.PublicClientApplication({
        auth: {
            clientId: process.env.REACT_APP_CLIENT as string,
            authority: process.env.REACT_APP_AUTHORITY,
            redirectUri: window.location.origin + '/mc',
        },
    });

    const authInstance = authService({
        MSAL: authClient,
        scopes: [process.env.REACT_APP_SCOPE] as string[],
    });

    let configurationAccessToken = '';

    if (offline != OfflineStatus.OFFLINE) {
        const isRedirecting = await authInstance.handleLogin();
        if (isRedirecting) return Promise.reject('redirecting');

        configurationAccessToken = await authInstance.getAccessToken([
            process.env.REACT_APP_CONFIG_SCOPE,
        ] as string[]);
    }

    render(<LoadingPage loadingText={'Initializing access token...'} />);
    let accessToken = '';
    let accessTokenCompletionApi = '';

    if (offline != OfflineStatus.OFFLINE) {
        accessToken = await authInstance.getAccessToken([
            process.env.REACT_APP_WEBAPI_SCOPE as string,
        ]);
        accessTokenCompletionApi = await authInstance.getAccessToken([
            process.env.REACT_APP_COMP_SCOPE as string,
        ]);
    }

    const completionBaseApiInstance = baseIPOApiService({
        authInstance,
        baseURL: process.env.REACT_APP_BASE_URL_COMP as string,
        scope: [process.env.REACT_APP_COMP_SCOPE] as string[],
    });

    const procosysApiInstance = procosysApiService(
        {
            baseURL: process.env.REACT_APP_BASE_URL_MAIN as string,
            apiVersion: process.env.REACT_APP_API_VERSION as string,
        },
        accessToken
    );

    const completionApiInstance = completionApiService({
        axios: completionBaseApiInstance,
    });

    render(<LoadingPage loadingText={'Initializing IPO access token...'} />);
    let accessTokenIPO = '';
    if (offline != OfflineStatus.OFFLINE) {
        accessTokenIPO = await authInstance.getAccessToken([
            process.env.REACT_APP_IPO_API_SCOPE,
        ] as string[]);
    }
    const procosysIPOApiInstance = procosysIPOApiService(
        {
            baseURL: process.env.REACT_APP_IPO_API_BASE_URL as string,
        },
        accessTokenIPO
    );

    const { appInsightsReactPlugin } = initializeAppInsights(
        process.env.REACT_APP_APP_INSIGHTS_INSTRUMENTATION_KEY as string
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
        completionApiInstance,
        completionBaseApiInstance,
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
    const status = getOfflineStatusfromLocalStorage();
    if (status != OfflineStatus.ONLINE && userPin == '') {
        setTimeout(renderApp, 1000);
        return;
    }

    if (status == OfflineStatus.CANCELLING) {
        let api = null;

        try {
            const {
                authInstance,
                procosysApiInstance,
                completionApiInstance,
                completionBaseApiInstance,
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
                    completionBaseApiInstance={completionBaseApiInstance}
                    appInsightsReactPlugin={appInsightsReactPlugin}
                    appConfig={appConfig}
                    featureFlags={featureFlags}
                    configurationAccessToken={configurationAccessToken}
                    procosysIPOApiInstance={procosysIPOApiInstance}
                    completionApiInstance={completionApiInstance}
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
                completionApiInstance,
                completionBaseApiInstance,
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
                    completionApiInstance={completionApiInstance}
                    completionBaseApiInstance={completionBaseApiInstance}
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
        const {
            authInstance,
            procosysApiInstance,
            appInsightsReactPlugin,
            appConfig,
            featureFlags,
            configurationAccessToken,
            procosysIPOApiInstance,
            completionApiInstance,
            completionBaseApiInstance,
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
                completionApiInstance={completionApiInstance}
                completionBaseApiInstance={completionBaseApiInstance}
            />
        );
    }
};

(async (): Promise<void> => {
    render(<LoadingPage loadingText={'Initializing...'} />);
    //await navigator.serviceWorker.ready; //wait until service worker is active
    try {
        const status = getOfflineStatusfromLocalStorage();
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

// Force build
