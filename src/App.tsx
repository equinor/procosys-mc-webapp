import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { McAppContextProvider } from './contexts/McAppContext';
import GeneralRouter from './GeneralRouter';
import ErrorBoundary from './components/error/ErrorBoundary';
import { IAuthService } from './services/authService';
import { ProcosysApiService } from './services/procosysApi';
import {
    AppInsightsContext,
    ReactPlugin,
} from '@microsoft/applicationinsights-react-js';
import { AppConfig, FeatureFlags } from './services/appConfiguration';
import { SavedSearchType } from './typings/enums';
import { ProcosysIPOApiService } from './services/procosysIPOApi';
import { SearchType } from '@equinor/procosys-webapp-components';
import { CompletionApiService } from './services/completionApi';
import { AxiosInstance } from 'axios';

export type McParams = {
    plant: string;
    project: string;
    checklistId: string;
    punchItemId: string;
    searchType: SearchType;
    entityId: string;
    savedSearchType: SavedSearchType;
    savedSearchId: string;
    proCoSysGuid: string;
    punchRowVersion: string;
};

type AppProps = {
    authInstance: IAuthService;
    procosysApiInstance: ProcosysApiService;
    completionApiInstance: CompletionApiService;
    completionBaseApiInstance: AxiosInstance;
    appInsightsReactPlugin: ReactPlugin;
    appConfig: AppConfig;
    featureFlags: FeatureFlags;
    configurationAccessToken: string;
    procosysIPOApiInstance: ProcosysIPOApiService;
};

const App = ({
    procosysApiInstance,
    authInstance,
    appConfig,
    appInsightsReactPlugin: reactPlugin,
    featureFlags,
    configurationAccessToken,
    procosysIPOApiInstance,
    completionApiInstance,
    completionBaseApiInstance,
}: AppProps): JSX.Element => {
    return (
        <AppInsightsContext.Provider value={reactPlugin}>
            <McAppContextProvider
                api={procosysApiInstance}
                auth={authInstance}
                appConfig={appConfig}
                featureFlags={featureFlags}
                configurationAccessToken={configurationAccessToken}
                ipoApi={procosysIPOApiInstance}
                completionApi={completionApiInstance}
                completionBaseApiInstance={completionBaseApiInstance}
            >
                <Router basename={'/mc'}>
                    <ErrorBoundary>
                        <Switch>
                            <Route
                                path="/:plant?/:project?"
                                component={GeneralRouter}
                            />
                            <Route render={(): JSX.Element => <h1>404</h1>} />
                        </Switch>
                    </ErrorBoundary>
                </Router>
            </McAppContextProvider>
        </AppInsightsContext.Provider>
    );
};

export default App;
