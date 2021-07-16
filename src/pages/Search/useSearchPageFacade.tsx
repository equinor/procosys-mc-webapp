import React, { useContext, useEffect, useReducer, useState } from 'react';
import axios, { CancelToken } from 'axios';
import PlantContext from '../../contexts/PlantContext';
import { SearchResults } from '../../services/apiTypes';
import { ProcosysApiService } from '../../services/procosysApi';
import { SearchType } from './Search';
import useCommonHooks from '../../utils/useCommonHooks';

export enum SearchStatus {
    INACTIVE,
    LOADING,
    SUCCESS,
    ERROR,
}

type SearchState = {
    searchStatus: SearchStatus;
    hits: SearchResults;
};

type Action =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: SearchResults }
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
    callOffQuery: string,
    dispatch: React.Dispatch<Action>,
    plantId: string,
    projectId: number,
    cancelToken: CancelToken,
    api: ProcosysApiService,
    searchType: SearchType
): Promise<void> => {
    dispatch({ type: 'FETCH_START' });
    try {
        const results = await api.getSearchResults(
            query,
            callOffQuery,
            projectId,
            plantId,
            searchType,
            cancelToken
        );
        dispatch({
            type: 'FETCH_SUCCESS',
            payload: results,
        });
    } catch (err) {
        dispatch({ type: 'FETCH_ERROR', error: 'err' });
    }
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useSearchPageFacade = (searchType: SearchType) => {
    const { api } = useCommonHooks();
    const [{ hits, searchStatus }, dispatch] = useReducer(fetchReducer, {
        hits: { maxAvailable: 0, items: [] },
        searchStatus: SearchStatus.INACTIVE,
    });
    const [query, setQuery] = useState('');
    const [callOffQuery, setCallOffQuery] = useState('');
    const { currentProject, currentPlant } = useContext(PlantContext);

    useEffect(() => {
        setCallOffQuery('');
        setQuery('');
    }, [searchType]);

    useEffect(() => {
        if (!currentPlant || !currentProject) return;
        if (query.length < 2 && callOffQuery.length < 2) {
            dispatch({ type: 'FETCH_INACTIVE' });
            return;
        }
        const { cancel, token } = axios.CancelToken.source();
        const timeOutId = setTimeout(
            () =>
                fetchHits(
                    query,
                    callOffQuery,
                    dispatch,
                    currentPlant.id,
                    currentProject.id,
                    token,
                    api,
                    searchType
                ),
            300
        );
        return (): void => {
            cancel('A new search has taken place instead');
            clearTimeout(timeOutId);
        };
    }, [query, callOffQuery, currentProject, currentPlant, api, searchType]);

    return {
        hits,
        searchStatus,
        query,
        setQuery,
        callOffQuery,
        setCallOffQuery,
    };
};

export default useSearchPageFacade;
