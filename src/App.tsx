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
import { SavedSearchType, SearchType } from './typings/enums';
import { GetOfflineScope } from './OfflineScope';

export type McParams = {
    plant: string;
    project: string;
    checklistId: string;
    punchItemId: string;
    searchType: SearchType;
    entityId: string;
    savedSearchType: SavedSearchType;
    savedSearchId: string;
};

type AppProps = {
    authInstance: IAuthService;
    procosysApiInstance: ProcosysApiService;
    appInsightsReactPlugin: ReactPlugin;
    appConfig: AppConfig;
    featureFlags: FeatureFlags;
};

const App = ({
    procosysApiInstance,
    authInstance,
    appConfig,
    appInsightsReactPlugin: reactPlugin,
    featureFlags,
}: AppProps): JSX.Element => {
    return (
        <>
            <GetOfflineScope></GetOfflineScope>
            <AppInsightsContext.Provider value={reactPlugin}>
                <McAppContextProvider
                    api={procosysApiInstance}
                    auth={authInstance}
                    appConfig={appConfig}
                    featureFlags={featureFlags}
                >
                    <Router basename={'/mc'}>
                        {/* <ErrorBoundary>
                        <Switch>
                            <Route
                                path="/:plant?/:project?"
                                component={GeneralRouter}
                            />
                            <Route render={(): JSX.Element => <h1>404</h1>} />
                        </Switch>
                    </ErrorBoundary> */}
                    </Router>
                </McAppContextProvider>
                <GetOfflineScope></GetOfflineScope>
            </AppInsightsContext.Provider>
        </>
    );
};

export default App;
