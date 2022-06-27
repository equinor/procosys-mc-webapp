import React, { useContext, useEffect, useReducer, useState } from 'react';
import axios, { CancelToken } from 'axios';
import {
    SearchResult,
    SearchState,
    SearchStatus,
} from '@equinor/procosys-webapp-components';
import { ProcosysApiService } from '../services/procosysApi';
import useCommonHooks from './useCommonHooks';
import PlantContext from '../contexts/PlantContext';

type Action =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: SearchResult }
    | { type: 'FETCH_ERROR'; error: string }
    | { type: 'FETCH_INACTIVE' };

const fetchReducer = (state: SearchState, action: Action): SearchState => {
    switch (action.type) {
        case 'FETCH_START':
            return {
                ...state,
                searchStatus: SearchStatus.LOADING,
                hits: { ...state.hits, persons: [] },
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
                hits: { ...state.hits, persons: [] },
            };
    }
};

const fetchHits = async (
    query: string,
    dispatch: React.Dispatch<Action>,
    plantId: string,
    cancelToken: CancelToken,
    api: ProcosysApiService
): Promise<void> => {
    dispatch({ type: 'FETCH_START' });
    try {
        const persons = await api.getPersonsByName(plantId, query, cancelToken);
        dispatch({
            type: 'FETCH_SUCCESS',
            payload: { persons },
        });
    } catch (err) {
        dispatch({ type: 'FETCH_ERROR', error: 'err' });
    }
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const usePersonsSearchFacade = () => {
    const { api } = useCommonHooks();
    const [{ hits, searchStatus }, dispatch] = useReducer(fetchReducer, {
        hits: { persons: [] },
        searchStatus: SearchStatus.INACTIVE,
    });
    const [query, setQuery] = useState('');
    const { currentPlant } = useContext(PlantContext);

    useEffect(() => {
        if (!currentPlant) return;
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
