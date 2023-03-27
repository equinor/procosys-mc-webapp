import { useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
    } = useContext(McAppContext);
    const params = useParams<McParams>();
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;
    const url = window.location.href;
    return {
        api,
        ipoApi,
        auth,
        params,
        navigate,
        location,
        url,
        path,
        appConfig,
        featureFlags,
        offlineState,
        setOfflineState,
        procosysApiSettings: appConfig.procosysWebApi,
        ipoApiSettings: appConfig.ipoApi,
        configurationAccessToken,
    };
};

export default useCommonHooks;
