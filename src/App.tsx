import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { McAppContextProvider } from './contexts/McAppContext';
import GeneralRouter from './GeneralRouter';
import ErrorBoundary from './components/error/ErrorBoundary';
import { IAuthService } from './services/authService';
import { ProcosysApiService } from './services/procosysApi';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import {
    AppInsightsContext,
    ReactPlugin,
} from '@microsoft/applicationinsights-react-js';
import { SearchType } from './pages/Search/Search';
import { ProcosysApiSettings } from './services/appConfiguration';
import { SavedSearchType } from './pages/Search/SavedSearches/SavedSearchResult';

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
    procosysApiSettings: ProcosysApiSettings;
};

const App = ({
    procosysApiInstance,
    authInstance,
    procosysApiSettings,
    appInsightsReactPlugin: reactPlugin,
}: AppProps): JSX.Element => {
    let rootDirectory = '';
    if (window.location.pathname.substr(0, 5) === '/mc') {
        rootDirectory = '/mc';
    }

    return (
        <AppInsightsContext.Provider value={reactPlugin}>
            <McAppContextProvider
                api={procosysApiInstance}
                auth={authInstance}
                procosysApiSettings={procosysApiSettings}
            >
                <Router basename={rootDirectory}>
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
