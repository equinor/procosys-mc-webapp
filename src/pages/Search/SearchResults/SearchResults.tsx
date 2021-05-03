import React from 'react';
import { SearchStatus } from '../useSearchPageFacade';
import { McPkgPreview } from '../../../services/apiTypes';
import SkeletonLoadingPage from '../../../components/loading/SkeletonLoader';
import { SearchType } from '../Search';
import SearchResult from './SearchResult';

type SearchResultsProps = {
    searchStatus: SearchStatus;
    searchResults: McPkgPreview[];
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
    if (searchStatus === SearchStatus.SUCCESS && searchResults.length > 0) {
        return (
            <div>
                {searchResults.map((searchResult) => (
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
