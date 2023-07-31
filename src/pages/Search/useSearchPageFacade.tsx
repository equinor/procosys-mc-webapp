import React, { useContext, useEffect, useReducer, useState } from 'react';
import PlantContext from '../../contexts/PlantContext';
import { SearchResults } from '../../services/apiTypes';
import { ProcosysApiService } from '../../services/procosysApi';
import useCommonHooks from '../../utils/useCommonHooks';
import { SearchType } from '@equinor/procosys-webapp-components';
import { ProcosysIPOApiService } from '../../services/procosysIPOApi';
import { SessionStorage } from '../../typings/enums';

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
    secondaryQuery: string,
    dispatch: React.Dispatch<Action>,
    plantId: string,
    projectId: number,
    abortSignal: AbortSignal,
    api: ProcosysApiService,
    searchType: string,
    ipoApi: ProcosysIPOApiService
): Promise<void> => {
    dispatch({ type: 'FETCH_START' });
    try {
        sessionStorage.setItem(SessionStorage.SEARCH_TYPE, searchType);
        sessionStorage.setItem(SessionStorage.SEARCH_QUERY, query);
        sessionStorage.setItem(SessionStorage.SECONDARY_QUERY, secondaryQuery);
        if (searchType === SearchType.IPO) {
            const results = await ipoApi.getIpoOnSearch(
                plantId,
                query,
                secondaryQuery,
                abortSignal
            );
            dispatch({
                type: 'FETCH_SUCCESS',
                payload: results,
            });
        } else {
            const results = await api.getSearchResults(
                query,
                secondaryQuery,
                projectId,
                plantId,
                searchType,
                abortSignal
            );
            dispatch({
                type: 'FETCH_SUCCESS',
                payload: results,
            });
        }
    } catch (err) {
        dispatch({ type: 'FETCH_ERROR', error: 'err' });
    }
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useSearchPageFacade = (searchType: string) => {
    const { api, ipoApi } = useCommonHooks();
    const [{ hits, searchStatus }, dispatch] = useReducer(fetchReducer, {
        hits: { maxAvailable: 0, items: [] },
        searchStatus: SearchStatus.INACTIVE,
    });
    const [query, setQuery] = useState('');
    const [secondaryQuery, setSecondaryQuery] = useState('');
    const { currentProject, currentPlant } = useContext(PlantContext);

    useEffect(() => {
        setSecondaryQuery('');
        setQuery('');
    }, [searchType]);

    useEffect(() => {
        if (!currentPlant || !currentProject) return;
        if (query.length < 2 && secondaryQuery.length < 2) {
            dispatch({ type: 'FETCH_INACTIVE' });
            return;
        }

        const controller = new AbortController();
        const signal = controller.signal;

        const timeOutId = setTimeout(
            () =>
                fetchHits(
                    query,
                    secondaryQuery,
                    dispatch,
                    currentPlant.id,
                    currentProject.id,
                    signal,
                    api,
                    searchType,
                    ipoApi
                ),
            300
        );
        return (): void => {
            controller.abort('A new search has taken place instead');
            clearTimeout(timeOutId);
        };
    }, [query, secondaryQuery, currentProject, currentPlant, api, searchType]);

    return {
        hits,
        searchStatus,
        query,
        setQuery,
        secondaryQuery,
        setSecondaryQuery,
    };
};

export default useSearchPageFacade;
