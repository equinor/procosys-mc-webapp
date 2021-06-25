import React from 'react';
import { SearchStatus } from '../useSearchPageFacade';
import {
    McPkgPreview,
    SearchResults as SearchResultsType,
    WoPreview,
} from '../../../services/apiTypes';
import SkeletonLoadingPage from '../../../components/loading/SkeletonLoader';
import { SearchType } from '../Search';
import McDetails from '../../../components/detailCards/McDetails';
import styled from 'styled-components';
import { isArrayOfType } from '../../../services/apiTypeGuards';
import EntityDetails from '../../../components/detailCards/EntityDetails';
import TextIcon from '../../../components/detailCards/TextIcon';
import useCommonHooks from '../../../utils/useCommonHooks';
import { COLORS } from '../../../style/GlobalStyles';

const SearchResultAmountWrapper = styled.h6`
    margin: 10px 0px;
`;

type SearchResultsProps = {
    searchStatus: SearchStatus;
    searchResults: SearchResultsType;
    searchType: SearchType;
};

const SearchResults = ({
    searchStatus,
    searchResults,
    searchType,
}: SearchResultsProps): JSX.Element => {
    const { history, url } = useCommonHooks();

    const getPlaceholderTextType = (): string => {
        if (searchType === SearchType.MC) {
            return 'MC Package number';
        } else if (searchType === SearchType.WO) {
            return 'Work Order number';
        }
        return '';
    };

    const getSearchResultType = (): string => {
        if (searchType === SearchType.MC) {
            return 'MC packages';
        } else if (searchType === SearchType.WO) {
            return 'Work Orders';
        }
        return '';
    };

    const determineContentToRender = (): JSX.Element => {
        if (
            searchType === SearchType.MC &&
            isArrayOfType<McPkgPreview>(searchResults.items, 'mcPkgNo')
        ) {
            return (
                <>
                    {searchResults.items.map((searchResult) => {
                        return (
                            <McDetails
                                key={searchResult.id}
                                mcPkgDetails={searchResult}
                            />
                        );
                    })}
                </>
            );
        } else if (
            searchType === SearchType.WO &&
            isArrayOfType<WoPreview>(searchResults.items, 'workOrderNo')
        ) {
            return (
                <>
                    {searchResults.items.map((searchResult) => {
                        return (
                            <EntityDetails
                                key={searchResult.id}
                                icon={
                                    <TextIcon
                                        color={COLORS.workOrderIcon}
                                        text="WO"
                                    />
                                }
                                headerText={searchResult.workOrderNo}
                                description={searchResult.title}
                                details={
                                    searchResult.disciplineCode
                                        ? [
                                              `${searchResult.disciplineCode}, ${searchResult.disciplineDescription}`,
                                          ]
                                        : undefined
                                }
                                onClick={(): void =>
                                    history.push(`${url}/WO/${searchResult.id}`)
                                }
                            />
                        );
                    })}
                </>
            );
        }
        return <></>;
    };

    if (
        searchStatus === SearchStatus.SUCCESS &&
        searchResults.items.length > 0
    ) {
        return (
            <div>
                <SearchResultAmountWrapper>
                    Displaying {searchResults.items.length} out of{' '}
                    {searchResults.maxAvailable} {getSearchResultType()}
                </SearchResultAmountWrapper>
                {determineContentToRender()}
            </div>
        );
    } else if (searchStatus === SearchStatus.LOADING) {
        return <SkeletonLoadingPage fullWidth />;
    } else if (searchStatus === SearchStatus.INACTIVE) {
        return (
            <div>
                <p>
                    <i>
                        Start typing your {getPlaceholderTextType()} in the
                        field above. <br />
                    </i>
                </p>
            </div>
        );
    } else if (searchStatus === SearchStatus.ERROR) {
        return (
            <div>
                <p>
                    <i>
                        An error occurred, please refresh this page and try
                        again.
                    </i>
                </p>
            </div>
        );
    } else {
        return (
            <div>
                <p>
                    <i>No {getSearchResultType()} found for this search.</i>
                </p>
            </div>
        );
    }
};

export default SearchResults;
