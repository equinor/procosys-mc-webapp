import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { AsyncStatus } from '../../../contexts/McAppContext';
import { SavedSearch } from '../../../services/apiTypes';
import useCommonHooks from '../../../utils/useCommonHooks';
import {
    CollapsibleCard,
    SkeletonLoadingPage,
} from '@equinor/procosys-webapp-components';
import SavedSearchResult from './SavedSearchResult';
import styled from 'styled-components';
import { Button, Scrim } from '@equinor/eds-core-react';
import { COLORS, SHADOW } from '../../../style/GlobalStyles';

const SavedSearchesWrapper = styled.div`
    margin: 16px 0;
`;
const DeletionPopup = styled.div`
    border-radius: 5px;
    background-color: ${COLORS.white};
    padding: 15px;
    box-shadow: ${SHADOW};
    & > :last-child {
        margin-left: 15px;
    }
`;

type SavedSearchesProps = {
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
};

const SavedSearches = ({
    setSnackbarText,
}: SavedSearchesProps): JSX.Element => {
    const { params, api } = useCommonHooks();
    const [searches, setSearches] = useState<SavedSearch[]>([]);
    const [fetchSearchesStatus, setFetchSearchesStatus] = useState(
        AsyncStatus.LOADING
    );
    const [searchToBeDeleted, setSearchToBeDeleted] = useState<number>(0);
    const [deleteSearchStatus, setDeleteSearchStatus] = useState<AsyncStatus>(
        AsyncStatus.SUCCESS
    );

    useEffect(() => {
        const controller = new AbortController();
        const abortSignal = controller.signal;
        (async (): Promise<void> => {
            try {
                const searchesFromApi = await api.getSavedSearches(
                    params.plant,
                    abortSignal
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
            controller.abort();
        };
    }, [params.plant]);

    const deleteASavedSearch = async (id: number): Promise<void> => {
        setDeleteSearchStatus(AsyncStatus.LOADING);
        try {
            await api.deleteSavedSearch(params.plant, id);
            setSearches((prevSearches) =>
                prevSearches.filter((search) => search.id != id)
            );
            setSearchToBeDeleted(0);
            setDeleteSearchStatus(AsyncStatus.SUCCESS);
        } catch {
            setSnackbarText('Unable to delete the search');
            setDeleteSearchStatus(AsyncStatus.ERROR);
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
                                deleteSavedSearch={setSearchToBeDeleted}
                                deleteSavedSearchStatus={deleteSearchStatus}
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
            {searchToBeDeleted ? (
                <Scrim
                    isDismissable
                    onClose={(): void => setSearchToBeDeleted(0)}
                    open={searchToBeDeleted != 0}
                >
                    <DeletionPopup>
                        <p>Really delete this item?</p>
                        <Button
                            variant={'outlined'}
                            onClick={(): void => setSearchToBeDeleted(0)}
                        >
                            Cancel
                        </Button>
                        <Button
                            color={'danger'}
                            disabled={
                                deleteSearchStatus === AsyncStatus.LOADING
                            }
                            onClick={async (): Promise<void> =>
                                deleteASavedSearch(searchToBeDeleted)
                            }
                            aria-label="Delete"
                        >
                            Delete
                        </Button>
                    </DeletionPopup>
                </Scrim>
            ) : null}
        </SavedSearchesWrapper>
    );
};

export default SavedSearches;
