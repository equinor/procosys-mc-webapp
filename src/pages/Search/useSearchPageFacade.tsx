import React, { useContext, useEffect, useReducer, useState } from 'react';
import axios, { CancelToken } from 'axios';
import PlantContext from '../../contexts/PlantContext';
import { CommPkgSearchResults } from '../../services/apiTypes';
import { ProcosysApiService } from '../../services/procosysApi';
import CommAppContext from '../../contexts/CommAppContext';

export enum SearchStatus {
    INACTIVE,
    LOADING,
    SUCCESS,
    ERROR,
}

type SearchState = {
    searchStatus: SearchStatus;
    hits: CommPkgSearchResults;
};

type Action =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: CommPkgSearchResults }
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
    projectID: number,
    cancelToken: CancelToken,
    api: ProcosysApiService
): Promise<void> => {
    dispatch({ type: 'FETCH_START' });
    try {
        const commPackages = await api.searchForCommPackage(
            query,
            projectID,
            plantID,
            cancelToken
        );
        dispatch({
            type: 'FETCH_SUCCESS',
            payload: commPackages,
        });
    } catch (err) {
        dispatch({ type: 'FETCH_ERROR', error: 'err' });
    }
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useSearchPageFacade = () => {
    const { api } = useContext(CommAppContext);
    const [{ hits, searchStatus }, dispatch] = useReducer(fetchReducer, {
        hits: { maxAvailable: 0, items: [] },
        searchStatus: SearchStatus.INACTIVE,
    });
    const [query, setQuery] = useState('');
    const { currentProject, currentPlant } = useContext(PlantContext);

    useEffect(() => {
        if (!currentPlant || !currentProject) return;
        if (query.length < 2) {
            dispatch({ type: 'FETCH_INACTIVE' });
            return;
        }
        const { cancel, token } = axios.CancelToken.source();
        const timeOutId = setTimeout(
            () =>
                fetchHits(
                    query,
                    dispatch,
                    currentPlant.id,
                    currentProject.id,
                    token,
                    api
                ),
            300
        );
        return (): void => {
            cancel('A new search has taken place instead');
            clearTimeout(timeOutId);
        };
    }, [query, currentProject, currentPlant, api]);

    return {
        hits,
        searchStatus,
        query,
        setQuery,
    };
};

export default useSearchPageFacade;
