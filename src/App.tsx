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
import { SearchType } from './pages/Search/Search';
import { AppConfig } from './services/appConfiguration';

export type McParams = {
    plant: string;
    project: string;
    checklistId: string;
    punchItemId: string;
    searchType: SearchType;
    entityId: string;
};

type AppProps = {
    authInstance: IAuthService;
    procosysApiInstance: ProcosysApiService;
    appInsightsReactPlugin: ReactPlugin;
    appConfig: AppConfig;
};

const App = ({
    procosysApiInstance,
    authInstance,
    appConfig,
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
                appConfig={appConfig}
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
