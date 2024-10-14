import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { createBrowserHistory } from 'history';

type InitializeAppInsights = {
    appInsightsReactPlugin: ReactPlugin;
    appInsightsInstance: ApplicationInsights;
};

const initializeAppInsights = (
    instrumentationKey: string
): InitializeAppInsights => {
    const browserHistory = createBrowserHistory({ basename: '' });
    const reactPlugin = new ReactPlugin();
    const appInsights = new ApplicationInsights({
        config: {
            instrumentationKey: instrumentationKey,
            extensions: [reactPlugin],
            extensionConfig: {
                [reactPlugin.identifier]: { history: browserHistory },
            },
            enableCorsCorrelation: true,
            loggingLevelConsole: 2,
            loggingLevelTelemetry: 2,
        },
    });
    appInsights.loadAppInsights();
    return {
        appInsightsReactPlugin: reactPlugin,
        appInsightsInstance: appInsights,
    };
};

export default initializeAppInsights;
