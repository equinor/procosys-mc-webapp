import React from 'react';
import { SearchStatus } from '../useSearchPageFacade';
import {
    McPkgPreview,
    PoPreview,
    SearchResults as SearchResultsType,
    TagPreview,
    WoPreview,
} from '../../../services/apiTypes';
import { SearchType } from '../Search';
import McDetails from '../../../components/detailCards/McDetails';
import styled from 'styled-components';
import { isArrayOfType } from '../../../services/apiTypeGuards';
import useCommonHooks from '../../../utils/useCommonHooks';
import { COLORS } from '../../../style/GlobalStyles';
import {
    EntityDetails,
    SkeletonLoadingPage,
    TextIcon,
} from '@equinor/procosys-webapp-components';
import useBookmarks from '../../../utils/useBookmarks';
import BookmarkableEntityInfoList from '../BookmarkableEntityInfoList';

const SearchResultAmountWrapper = styled.h6`
    margin: 10px 0px;
`;

type SearchResultsProps = {
    searchStatus: SearchStatus;
    searchResults: SearchResultsType;
    searchType: string;
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
            return 'Work Order number';
        } else if (searchType === SearchType.Tag) {
            return 'Tag number';
        } else {
            return 'Purchase Order number and/or call off number';
        }
    };

    const getSearchResultType = (): string => {
        if (searchType === SearchType.MC) {
            return 'MC packages';
        } else if (searchType === SearchType.WO) {
            return 'Work Orders';
        } else if (searchType === SearchType.Tag) {
            return 'Tags';
        } else {
            return 'Purchase Orders';
        }
    };

    if (searchType in SearchType === false) {
        return (
            <div>
                <p>
                    <i>
                        The chosen search type is not supported. Please choose a
                        supported search type by clicking one of the buttons
                        above.
                    </i>
                </p>
            </div>
        );
    } else if (
        searchStatus === SearchStatus.SUCCESS &&
        searchResults.items.length > 0
    ) {
        return (
            <div>
                <SearchResultAmountWrapper>
                    Displaying {searchResults.items.length} out of{' '}
                    {searchResults.maxAvailable} {getSearchResultType()}
                </SearchResultAmountWrapper>
                <BookmarkableEntityInfoList
                    searchType={searchType}
                    entityInfoList={searchResults.items}
                />
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
                        field{searchType === SearchType.PO ? 's' : ''} above.
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
