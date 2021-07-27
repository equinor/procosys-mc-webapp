import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { AsyncStatus } from '../../../contexts/McAppContext';
import { SavedSearch } from '../../../services/apiTypes';
import useCommonHooks from '../../../utils/useCommonHooks';
import { CollapsibleCard } from '@equinor/procosys-webapp-components';
import SkeletonLoadingPage from '../../../components/loading/SkeletonLoader';
import SavedSearchResult from './SavedSearchResult';
import styled from 'styled-components';

const SavedSearchesWrapper = styled.div`
    margin: 16px 0;
`;

type SavedSearchesProps = {
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
};

const SavedSearches = ({
    setSnackbarText,
}: SavedSearchesProps): JSX.Element => {
    const [searches, setSearches] = useState<SavedSearch[]>([]);
    const [fetchSearchesStatus, setFetchSearchesStatus] = useState(
        AsyncStatus.LOADING
    );
    const { params, api } = useCommonHooks();

    useEffect(() => {
        const source = Axios.CancelToken.source();
        (async (): Promise<void> => {
            try {
                const searchesFromApi = await api.getSavedSearches(
                    params.plant,
                    source.token
                );
                if (searchesFromApi.length > 0) {
                    setSearches(searchesFromApi);
                    setFetchSearchesStatus(AsyncStatus.SUCCESS);
                } else {
                    setFetchSearchesStatus(AsyncStatus.EMPTY_RESPONSE);
                }
            } catch {
                setFetchSearchesStatus(AsyncStatus.ERROR);
            }
        })();
        return (): void => {
            source.cancel();
        };
    }, [params.plant]);

    const deleteASavedSearch = async (id: number): Promise<void> => {
        try {
            await api.deleteSavedSearch(params.plant, id);
            setSearches((prevSearches) =>
                prevSearches.filter((search) => search.id != id)
            );
        } catch (error) {
            setSnackbarText(error.toString());
        }
    };

    const determineContent = (): JSX.Element => {
        if (
            fetchSearchesStatus === AsyncStatus.SUCCESS &&
            searches != undefined
        ) {
            return (
                <div>
                    {searches.map((search) => {
                        return (
                            <SavedSearchResult
                                key={search.id}
                                search={search}
                                deleteSavedSearch={deleteASavedSearch}
                            />
                        );
                    })}
                </div>
            );
        } else if (fetchSearchesStatus === AsyncStatus.ERROR) {
            return (
                <p>
                    <i>
                        An error occurred, please refresh this page and try
                        again.
                    </i>
                </p>
            );
        } else if (fetchSearchesStatus === AsyncStatus.EMPTY_RESPONSE) {
            return (
                <p>
                    <i> No saved searches in ProCoSys.</i>
                </p>
            );
        } else {
            return <SkeletonLoadingPage />;
        }
    };

    return (
        <SavedSearchesWrapper>
            <CollapsibleCard cardTitle="Saved Searches">
                {determineContent()}
            </CollapsibleCard>
        </SavedSearchesWrapper>
    );
};

export default SavedSearches;
