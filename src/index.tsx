import ErrorPage from './components/error/ErrorPage';
import LoadingPage from './components/loading/LoadingPage';
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

    const { procosysApiConfig, appInsightsConfig } = await getAppConfig(
        configurationEndpoint,
        configurationAccessToken
    );
    const baseApiInstance = baseApiService({
        authInstance,
        baseURL: procosysApiConfig.baseUrl,
        scope: procosysApiConfig.scope,
    });

    const procosysApiInstance = procosysApiService({
        axios: baseApiInstance,
        apiVersion: procosysApiConfig.apiVersion,
    });
    const {
        appInsightsInstance,
        appInsightsReactPlugin,
    } = initializeAppInsights(appInsightsConfig.instrumentationKey);
    return {
        authInstance,
        procosysApiInstance,
        appInsightsInstance,
        appInsightsReactPlugin,
    };
};

(async (): Promise<void> => {
    render(<LoadingPage loadingText={'Initializing...'} />);
    try {
        const {
            authInstance,
            procosysApiInstance,
            appInsightsInstance,
            appInsightsReactPlugin,
        } = await initialize();
        render(
            <App
                authInstance={authInstance}
                procosysApiInstance={procosysApiInstance}
                appInsightsInstance={appInsightsInstance}
                appInsightsReactPlugin={appInsightsReactPlugin}
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
                />
            );
        }
    }
})();
