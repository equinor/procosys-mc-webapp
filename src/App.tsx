import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { CommAppContextProvider } from './contexts/CommAppContext';
import GeneralRouter from './GeneralRouter';
import ErrorBoundary from './components/error/ErrorBoundary';
import { IAuthService } from './services/authService';
import { ProcosysApiService } from './services/procosysApi';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import {
    AppInsightsContext,
    ReactPlugin,
} from '@microsoft/applicationinsights-react-js';

export type CommParams = {
    plant: string;
    project: string;
    commPkg: string;
    taskId: string;
    checklistId: string;
    punchItemId: string;
};

type AppProps = {
    authInstance: IAuthService;
    procosysApiInstance: ProcosysApiService;
    appInsightsInstance: ApplicationInsights;
    appInsightsReactPlugin: ReactPlugin;
};

const App = ({
    procosysApiInstance,
    authInstance,
    appInsightsInstance,
    appInsightsReactPlugin: reactPlugin,
}: AppProps): JSX.Element => {
    let rootDirectory = '';
    if (window.location.pathname.substr(0, 5) === '/comm') {
        rootDirectory = '/comm';
    }

    return (
        <AppInsightsContext.Provider value={reactPlugin}>
            <CommAppContextProvider
                api={procosysApiInstance}
                auth={authInstance}
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
            </CommAppContextProvider>
        </AppInsightsContext.Provider>
    );
};

export default App;
