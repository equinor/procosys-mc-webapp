import React from 'react';
import { SearchStatus } from '../useSearchPageFacade';
import { SearchResults as SearchResultsType } from '../../../services/apiTypes';
import SkeletonLoadingPage from '../../../components/loading/SkeletonLoader';
import { SearchType } from '../Search';
import SearchResult from './SearchResult';
import styled from 'styled-components';

const SearchResultAmountWrapper = styled.h6`
    text-align: center;
    margin: 12px 0px;
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
    const getPlaceholderTextType = (): string => {
        if (searchType === SearchType.MC) {
            return 'mechanical completion package number';
        }
        return '';
    };

    const getSearchResultType = (): string => {
        if (searchType === SearchType.MC) {
            return 'MC packages';
        }
        return '';
    };

    if (searchStatus === SearchStatus.LOADING) {
        return <SkeletonLoadingPage fullWidth />;
    }
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
                {searchResults.items.map((searchResult) => (
                    <SearchResult
                        key={searchResult.id}
                        searchResult={searchResult}
                        searchType={searchType}
                    />
                ))}
            </div>
        );
    }
    if (searchStatus === SearchStatus.INACTIVE) {
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
    }

    if (searchStatus === SearchStatus.ERROR) {
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
    }

    return (
        <div>
            <p>
                <i>No {getSearchResultType()} found for this search.</i>
            </p>
        </div>
    );
};

export default SearchResults;
