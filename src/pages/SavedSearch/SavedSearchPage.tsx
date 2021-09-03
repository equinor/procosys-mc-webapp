import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { AsyncStatus } from '../../contexts/McAppContext';
import {
    ChecklistSavedSearchResult,
    PunchItemSavedSearchResult,
    SavedSearch,
} from '../../services/apiTypes';
import removeSubdirectories from '../../utils/removeSubdirectories';
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
import PageHeader from '../../components/PageHeader';

const DetailsWrapper = styled.div`
    padding: 0 4%;
    & > p {
        padding: 12px 0;
    }
`;

const ResultAmount = styled.h6`
    margin: 0 4%;
`;

const SavedSearchPage = (): JSX.Element => {
    const { url, params, api, history } = useCommonHooks();
    const [savedSearch, setSavedSearch] = useState<SavedSearch>();
    const [results, setResults] = useState<
        ChecklistSavedSearchResult[] | PunchItemSavedSearchResult[]
    >();
    const [fetchResultsStatus, setFetchResultsStatus] = useState<AsyncStatus>(
        AsyncStatus.LOADING
    );

    useEffect(() => {
        const source = Axios.CancelToken.source();
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
                </div>
            </AsyncPage>
        </main>
    );
};

export default SavedSearchPage;
