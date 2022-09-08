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
        offlineState,
        setOfflineState,
        configurationAccessToken,
    } = useContext(McAppContext);
    const params = useParams<McParams>();
    const history = useHistory();
    const { url, path } = useRouteMatch();
    return {
        api,
        auth,
        params,
        history,
        url,
        path,
        appConfig,
        offlineState,
        setOfflineState,
        procosysApiSettings: appConfig.procosysWebApi,
        configurationAccessToken,
    };
};

export default useCommonHooks;
