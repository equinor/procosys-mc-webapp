import { useContext } from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { McParams } from '../App';
import CommAppContext from '../contexts/McAppContext';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useCommonHooks = () => {
    const { api, auth } = useContext(CommAppContext);
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
    };
};

export default useCommonHooks;
