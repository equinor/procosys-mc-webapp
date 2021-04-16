import Axios, { CancelToken } from 'axios';
import { useEffect, useState } from 'react';
import { AsyncStatus } from '../contexts/CommAppContext';

function useAsyncGet<T>(
    asyncFunction: (cancelToken: CancelToken) => Promise<T>
): {
    response: T | undefined;
    fetchStatus: AsyncStatus;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
} {
    const [response, setResponse] = useState<T>();
    const [fetchStatus, setFetchStatus] = useState(AsyncStatus.INACTIVE);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const source = Axios.CancelToken.source();
        (async (): Promise<void> => {
            setFetchStatus(AsyncStatus.LOADING);
            try {
                const responseFromApi = await asyncFunction(source.token);
                setResponse(responseFromApi);
                setFetchStatus(AsyncStatus.SUCCESS);
                if (
                    Array.isArray(responseFromApi) &&
                    responseFromApi.length < 1
                ) {
                    setFetchStatus(AsyncStatus.EMPTY_RESPONSE);
                } else {
                    setFetchStatus(AsyncStatus.SUCCESS);
                }
            } catch (error) {
                if (!Axios.isCancel(error)) setFetchStatus(AsyncStatus.ERROR);
            }
        })();
        return (): void => {
            source.cancel();
        };
    }, [refresh]);

    return {
        response,
        fetchStatus,
        setRefresh,
    };
}

export default useAsyncGet;
