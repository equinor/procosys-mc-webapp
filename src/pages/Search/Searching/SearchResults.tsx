import React from 'react';
import { SearchStatus } from '../useSearchPageFacade';
import { SearchResults as SearchResultsType } from '../../../services/apiTypes';
import styled from 'styled-components';
import { SkeletonLoadingPage } from '@equinor/procosys-webapp-components';
import BookmarkableEntityInfoList from '../BookmarkableEntityInfoList';
import useBookmarks from '../../../utils/useBookmarks';
import { SearchType } from '../../../typings/enums';
import useCommonHooks from '../../../utils/useCommonHooks';

const SearchResultAmountWrapper = styled.h6`
    margin: 10px 0px;
`;

type SearchResultsProps = {
    searchStatus: SearchStatus;
    searchResults: SearchResultsType;
    searchType: string;
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
};

const SearchResults = ({
    searchStatus,
    searchResults,
    searchType,
    setSnackbarText,
}: SearchResultsProps): JSX.Element => {
    const { offlineState, featureFlags } = useCommonHooks();
    const { isBookmarked, handleBookmarkClicked } = useBookmarks({
        setSnackbarText,
    });
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
                    isBookmarked={isBookmarked}
                    handleBookmarkClicked={handleBookmarkClicked}
                    entityInfoList={searchResults.items}
                    offlinePlanningState={!offlineState}
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
                <p></p>
                <p>
                    Bookmarks: The entities in the search result can be
                    bookmarked by clicking the icon to the right of the entities
                    (toggle on/off). Go to Bookmark page (tab below) to see the
                    bookmarked entities.
                </p>
                {featureFlags.offlineFunctionalityIsEnabled ? (
                    <p>
                        Offline: In the Bookmark page you can choose to go
                        offline with the bookmarked entities. You will then be
                        able to use the app without internet connection. Note
                        that you MUST stop offline mode to get your changes
                        uploaded to the server. This should be done preferably
                        at the end of the working day.
                    </p>
                ) : (
                    <p>
                        In a future release you will be able to work offline
                        with the bookmarked entities.
                    </p>
                )}
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
