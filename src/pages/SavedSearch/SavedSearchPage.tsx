import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { AsyncStatus } from '../../contexts/McAppContext';
import {
    ChecklistSavedSearchResult,
    PunchItemSavedSearchResult,
    SavedSearch,
} from '../../services/apiTypes';
import useCommonHooks from '../../utils/useCommonHooks';
import { SavedSearchType } from '../Search/SavedSearches/SavedSearchResult';
import AsyncPage from '../../components/AsyncPage';
import { isArrayOfType } from '../../services/apiTypeGuards';
import {
    BackButton,
    InfoItem,
    Navbar,
} from '@equinor/procosys-webapp-components';
import styled from 'styled-components';
import { Button, DotProgress } from '@equinor/eds-core-react';
import removeSubdirectories from '../../utils/removeSubdirectories';
import { PageHeader } from '@equinor/procosys-webapp-components';

const DetailsWrapper = styled.div`
    padding: 0 4%;
    & > p {
        padding: 12px 0;
    }
`;

const ResultAmount = styled.h6`
    margin: 0 4%;
`;

const ButtonWrapper = styled.div`
    padding: 8px 0 32px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 36px;
`;

const SavedSearchPage = (): JSX.Element => {
    const { url, params, api, history } = useCommonHooks();
    const [savedSearch, setSavedSearch] = useState<SavedSearch>();
    const [results, setResults] = useState<
        ChecklistSavedSearchResult[] | PunchItemSavedSearchResult[]
    >([]);
    const [fetchResultsStatus, setFetchResultsStatus] = useState<AsyncStatus>(
        AsyncStatus.LOADING
    );
    const [fetchMoreResultsStatus, setFetchMoreResultsStatus] =
        useState<AsyncStatus>(AsyncStatus.INACTIVE);
    const [nextPageNumber, setNextPageNumber] = useState<number>(1);
    const source = Axios.CancelToken.source();

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const [savedSearchesFromApi, resultsFromAPI] =
                    await Promise.all([
                        api.getSavedSearches(params.plant, source.token),
                        api.getSavedSearchResults(
                            params.plant,
                            params.savedSearchId,
                            params.savedSearchType,
                            source.token
                        ),
                    ]);
                setSavedSearch(
                    savedSearchesFromApi.find(
                        (search) => search.id.toString() == params.savedSearchId
                    )
                );
                if (resultsFromAPI.length > 0) {
                    setResults(resultsFromAPI);
                    setFetchResultsStatus(AsyncStatus.SUCCESS);
                } else {
                    setFetchResultsStatus(AsyncStatus.EMPTY_RESPONSE);
                }
            } catch {
                setFetchResultsStatus(AsyncStatus.ERROR);
            }
        })();
        return (): void => {
            source.cancel();
        };
    }, [params]);

    const handleLoadMore = async (): Promise<void> => {
        setFetchMoreResultsStatus(AsyncStatus.LOADING);
        try {
            const newResults = await api.getSavedSearchResults(
                params.plant,
                params.savedSearchId,
                params.savedSearchType,
                source.token,
                nextPageNumber
            );
            if (newResults.length === 0) {
                setFetchMoreResultsStatus(AsyncStatus.EMPTY_RESPONSE);
                return;
            }
            const allResults = [...results, ...newResults];
            if (
                isArrayOfType<ChecklistSavedSearchResult>(
                    allResults,
                    'isSigned'
                ) ||
                isArrayOfType<PunchItemSavedSearchResult>(
                    allResults,
                    'isCleared'
                )
            ) {
                setResults(allResults);
                setFetchMoreResultsStatus(AsyncStatus.SUCCESS);
                setNextPageNumber((prevValue) => prevValue + 1);
            } else {
                setFetchMoreResultsStatus(AsyncStatus.ERROR);
            }
        } catch {
            setFetchMoreResultsStatus(AsyncStatus.ERROR);
        }
    };

    const determineDetails = (): JSX.Element => {
        if (
            (fetchResultsStatus === AsyncStatus.SUCCESS ||
                fetchResultsStatus === AsyncStatus.EMPTY_RESPONSE) &&
            savedSearch != undefined
        ) {
            return (
                <DetailsWrapper>
                    <PageHeader
                        title="Saved search"
                        subtitle={savedSearch.name}
                    />
                </DetailsWrapper>
            );
        } else {
            return (
                <DetailsWrapper>
                    <p>Unable to load title. Please reload</p>
                </DetailsWrapper>
            );
        }
    };

    const determineContent = (): JSX.Element => {
        if (
            params.savedSearchType === SavedSearchType.CHECKLIST &&
            isArrayOfType<ChecklistSavedSearchResult>(results, 'isSigned')
        ) {
            return (
                <div>
                    {results.map((checklist) => (
                        <InfoItem
                            isScope
                            key={checklist.id}
                            attachments={checklist.attachmentCount}
                            status={checklist.status}
                            statusLetters={[
                                checklist.isSigned ? 'S' : null,
                                checklist.isVerified ? 'V' : null,
                            ]}
                            headerText={checklist.tagNo}
                            description={checklist.tagDescription}
                            chips={[
                                checklist.formularType,
                                checklist.responsibleCode,
                            ]}
                            onClick={(): void =>
                                history.push(`${url}/checklist/${checklist.id}`)
                            }
                        />
                    ))}
                </div>
            );
        } else if (
            params.savedSearchType === SavedSearchType.PUNCH &&
            isArrayOfType<PunchItemSavedSearchResult>(results, 'isCleared')
        ) {
            return (
                <div>
                    {results.map((punch) => (
                        <InfoItem
                            key={punch.id}
                            status={punch.status}
                            statusLetters={[
                                punch.isCleared ? 'C' : null,
                                punch.isVerified ? 'V' : null,
                            ]}
                            attachments={punch.attachmentCount}
                            headerText={punch.id.toString()}
                            description={punch.description}
                            chips={[punch.formularType, punch.responsibleCode]}
                            tag={punch.tagNo}
                            onClick={(): void =>
                                history.push(`${url}/punch-item/${punch.id}`)
                            }
                        />
                    ))}
                </div>
            );
        } else {
            return <></>;
        }
    };

    const determineLoadMoreButton = (): JSX.Element => {
        if (fetchMoreResultsStatus === AsyncStatus.LOADING) {
            return (
                <ButtonWrapper>
                    <DotProgress color="primary" />
                </ButtonWrapper>
            );
        } else {
            return (
                <ButtonWrapper>
                    {fetchMoreResultsStatus === AsyncStatus.ERROR ? (
                        <p>
                            <i>
                                Could not load more results. Try again or reload
                                the page.
                            </i>
                        </p>
                    ) : null}
                    <div>
                        <Button
                            variant="ghost"
                            onClick={handleLoadMore}
                            disabled={
                                fetchMoreResultsStatus ===
                                AsyncStatus.EMPTY_RESPONSE
                            }
                        >
                            Load More
                        </Button>
                    </div>
                </ButtonWrapper>
            );
        }
    };

    return (
        <main>
            <Navbar
                noBorder
                leftContent={
                    <BackButton to={`${removeSubdirectories(url, 3)}`} />
                }
            />
            <AsyncPage
                errorMessage={
                    'Unable to load the search results. Please try again.'
                }
                emptyContentMessage={'This search has no results.'}
                fetchStatus={fetchResultsStatus}
            >
                <div>
                    {determineDetails()}
                    <ResultAmount>
                        Displaying {results?.length} search results
                    </ResultAmount>
                    {determineContent()}
                    {determineLoadMoreButton()}
                </div>
            </AsyncPage>
        </main>
    );
};

export default SavedSearchPage;
