import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { AsyncStatus } from '../../contexts/McAppContext';
import { SavedSearch } from '../../services/apiTypes';
import useCommonHooks from '../../utils/useCommonHooks';

const SavedSearches = (): JSX.Element => {
    const [searches, setSearches] = useState<SavedSearch[]>();
    const [fetchSearchesStatus, setFetchSearchesStatus] = useState(
        AsyncStatus.LOADING
    );
    const { params, api } = useCommonHooks();
    useEffect(() => {
        const source = Axios.CancelToken.source();
        async (): Promise<void> => {
            try {
                const searches = await api.getSavedSearches(
                    params.plant,
                    source.token
                );
                setSearches(searches);
                setFetchSearchesStatus(AsyncStatus.SUCCESS);
            } catch {
                setFetchSearchesStatus(AsyncStatus.ERROR);
            }
        };
        return (): void => {
            source.cancel();
        };
    }, [params]);

    return <></>;
};

export default SavedSearches;
