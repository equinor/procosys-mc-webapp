import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Navbar from '../../components/navigation/Navbar';
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
import { InfoItem } from '@equinor/procosys-webapp-components';
import styled from 'styled-components';
import { DotProgress } from '@equinor/eds-core-react';
import { COLORS } from '../../style/GlobalStyles';

const DetailsWrapper = styled.p`
    padding: 12px;
    background-color: ${COLORS.fadedBlue};
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
        if (fetchResultsStatus === AsyncStatus.LOADING) {
            return (
                <DetailsWrapper>
                    <DotProgress color="primary" />
                </DetailsWrapper>
            );
        } else if (
            (fetchResultsStatus === AsyncStatus.SUCCESS ||
                fetchResultsStatus === AsyncStatus.EMPTY_RESPONSE) &&
            savedSearch != undefined
        ) {
            return <DetailsWrapper>{savedSearch.name}</DetailsWrapper>;
        } else {
            return (
                <DetailsWrapper>
                    Unable to load title. Please reload
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
                leftContent={{
                    name: 'back',
                    label: 'Back',
                    url: `${removeSubdirectories(url, 3)}`,
                }}
                midContent={`Saved ${params.savedSearchType} search`}
            />
            {determineDetails()}
            <AsyncPage
                errorMessage={
                    'Unable to load the search results. Please try again.'
                }
                emptyContentMessage={'This search has no results.'}
                fetchStatus={fetchResultsStatus}
            >
                {determineContent()}
            </AsyncPage>
        </main>
    );
};

export default SavedSearchPage;
