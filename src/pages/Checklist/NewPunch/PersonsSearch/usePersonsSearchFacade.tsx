import React, { useContext, useEffect, useReducer, useState } from 'react';
import axios, { CancelToken } from 'axios';
import { SearchStatus } from '../../../Search/useSearchPageFacade';
import { ProcosysApiService } from '../../../../services/procosysApi';
import useCommonHooks from '../../../../utils/useCommonHooks';
import PlantContext from '../../../../contexts/PlantContext';

type SearchState = {
    searchStatus: SearchStatus;
    hits: any; // TODO: replace with type from the new api endpoint for persons search
};

type Action =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: any } // TODO: replace type with type used in search state type above
    | { type: 'FETCH_ERROR'; error: string }
    | { type: 'FETCH_INACTIVE' };

const fetchReducer = (state: SearchState, action: Action): SearchState => {
    switch (action.type) {
        case 'FETCH_START':
            return {
                ...state,
                searchStatus: SearchStatus.LOADING,
                hits: { ...state.hits, items: [] },
            };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                searchStatus: SearchStatus.SUCCESS,
                hits: action.payload,
            };
        case 'FETCH_ERROR':
            return {
                ...state,
                searchStatus: SearchStatus.ERROR,
            };
        case 'FETCH_INACTIVE':
            return {
                ...state,
                searchStatus: SearchStatus.INACTIVE,
                hits: { ...state.hits, items: [] },
            };
    }
};

const fetchHits = async (
    query: string,
    dispatch: React.Dispatch<Action>,
    plantID: string,
    cancelToken: CancelToken,
    api: ProcosysApiService
): Promise<void> => {
    dispatch({ type: 'FETCH_START' });
    try {
        const persons = await api.getPersonsByName(plantID, query, cancelToken);
        dispatch({
            type: 'FETCH_SUCCESS',
            payload: persons,
        });
    } catch (err) {
        dispatch({ type: 'FETCH_ERROR', error: 'err' });
    }
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const usePersonsSearchFacade = () => {
    const { api } = useCommonHooks();
    const [{ hits, searchStatus }, dispatch] = useReducer(fetchReducer, {
        hits: { maxAvailable: 0, items: [] }, // TODO: must change this once return type has been changed
        searchStatus: SearchStatus.INACTIVE,
    });
    const [query, setQuery] = useState('');
    const { currentPlant } = useContext(PlantContext);

    useEffect(() => {
        if (!currentPlant) return;
        // TODO: check whether it should start searching at length == 1 (use query.length < 1 below)
        if (query.length < 2) {
            dispatch({ type: 'FETCH_INACTIVE' });
            return;
        }
        const { cancel, token } = axios.CancelToken.source();
        const timeOutId = setTimeout(
            () => fetchHits(query, dispatch, currentPlant.id, token, api),
            300
        );
        return (): void => {
            cancel('A new search has taken place instead');
            clearTimeout(timeOutId);
        };
    }, [query, currentPlant, api]);

    return {
        hits,
        searchStatus,
        query,
        setQuery,
    };
};

export default usePersonsSearchFacade;
