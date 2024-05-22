import { useContext } from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { McParams } from '../App';
import McAppContext from '../contexts/McAppContext';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useCommonHooks = () => {
    const {
        api,
        auth,
        appConfig,
        featureFlags,
        offlineState,
        setOfflineState,
        configurationAccessToken,
        ipoApi,
        completionApi,
        completionBaseApiInstance,
    } = useContext(McAppContext);
    const params = useParams<McParams>();
    const history = useHistory();
    const { url, path } = useRouteMatch();
    return {
        api,
        ipoApi,
        auth,
        params,
        history,
        url,
        path,
        appConfig,
        featureFlags,
        offlineState,
        setOfflineState,
        procosysApiSettings: appConfig.procosysWebApi,
        ipoApiSettings: appConfig.ipoApi,
        configurationAccessToken,
        completionApi,
        completionBaseApiInstance,
    };
};

export default useCommonHooks;
