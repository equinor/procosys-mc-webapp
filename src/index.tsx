import GlobalStyles from './style/GlobalStyles';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import authService from './services/authService';
import * as MSAL from '@azure/msal-browser';
import baseApiService from './services/baseApi';
import procosysApiService from './services/procosysApi';
import { getAppConfig, getAuthConfig } from './services/appConfiguration';
import initializeAppInsights from './services/appInsights';
import {
    ErrorPage,
    ReloadButton,
    LoadingPage,
} from '@equinor/procosys-webapp-components';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { GetOfflineScope, MakeHttpCallComponent } from './OfflineScope';
import procosysApiByFetchService from './services/procosysApiByFetch';

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

    const baseApiInstance = baseApiService({
        authInstance,
        baseURL: appConfig.procosysWebApi.baseUrl,
        scope: appConfig.procosysWebApi.scope,
    });

    const procosysApiInstance = procosysApiService({
        axios: baseApiInstance,
        apiVersion: appConfig.procosysWebApi.apiVersion,
    });

    const procosysApiByFetchInstance = procosysApiByFetchService(
        { apiVersion: appConfig.procosysWebApi.apiVersion },
        await authInstance.getAccessToken(appConfig.procosysWebApi.scope)
    );

    const { appInsightsReactPlugin } = initializeAppInsights(
        appConfig.appInsights.instrumentationKey
    );
    return {
        authInstance,
        procosysApiInstance,
        procosysApiByFetchInstance,
        appInsightsReactPlugin,
        appConfig,
        featureFlags,
    };
};

(async (): Promise<void> => {
    render(<LoadingPage loadingText={'Initializing...'} />);
    // eslint-disable-next-line react/jsx-no-undef

    try {
        const {
            authInstance,
            procosysApiInstance,
            procosysApiByFetchInstance,
            appInsightsReactPlugin,
            appConfig,
            featureFlags,
        } = await initialize();
        render(
            <App
                authInstance={authInstance}
                procosysApiInstance={procosysApiInstance}
                procosysApiByFetchInstance={procosysApiByFetchInstance}
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
                <>
                    <GetOfflineScope></GetOfflineScope>
                    <MakeHttpCallComponent></MakeHttpCallComponent>
                    <ErrorPage
                        title="Unable to initialize app"
                        description="Check your connection or reload this page and try again. If problem persists, contact customer support"
                        actions={[<ReloadButton key={'reload'} />]}
                    />
                </>
            );
        }
    }
})();
