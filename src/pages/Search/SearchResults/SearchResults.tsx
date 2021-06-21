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
import { isArrayOfType, isOfType } from '../../../services/apiTypeGuards';

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
    const getPlaceholderTextType = (): string => {
        if (searchType === SearchType.MC) {
            return 'MC Package number';
        } else if (searchType === SearchType.WO) {
            // TODO: add whatever they search for in wo search
            return '';
        }
        return '';
    };

    const getSearchResultType = (): string => {
        if (searchType === SearchType.MC) {
            return 'MC packages';
        } else if (searchType === SearchType.WO) {
            // TODO: is this correct?
            return 'work orders';
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
                        // TODO: return something
                        return <></>;
                    })}
                </>
            );
        }
        // TODO: decide what to return if not correct
        return <></>;
    };

    // TODO: reorder the ifs, like in clear punch??

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
                {determineContentToRender()}
                {searchResults.items.map((searchResult) => {
                    if (
                        searchType === SearchType.MC &&
                        isOfType<McPkgPreview>(searchResult, 'mcPkgNo')
                    ) {
                        return (
                            <McDetails
                                key={searchResult.id}
                                mcPkgDetails={searchResult}
                            />
                        );
                    }
                })}
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
