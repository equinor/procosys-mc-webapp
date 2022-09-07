import React from 'react';
import styled from 'styled-components';
import { Button } from '@equinor/eds-core-react';
import useBookmarks from '../../../utils/useBookmarks';
import BookmarkableEntityInfoList from '../BookmarkableEntityInfoList';
import { SearchType } from '../../../typings/enums';
import useCommonHooks from '../../../utils/useCommonHooks';
import AsyncPage from '../../../components/AsyncPage';

const BookmarksWrapper = styled.div`
    margin: 16px 0;
`;

const ButtonsWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Bookmarks = (): JSX.Element => {
    const {
        currentBookmarks,
        bookmarksStatus,
        isBookmarked,
        handleBookmarkClicked,
        cancelOffline,
        startOffline,
        isDownloading,
    } = useBookmarks();
    const { offlineState } = useCommonHooks();

    return (
        <AsyncPage
            fetchStatus={bookmarksStatus}
            emptyContentMessage={"You don't have any offline bookmarks"}
            errorMessage={
                "Couldn't get bookmarks, please reload page to try again"
            }
            loadingMessage={
                isDownloading
                    ? 'Downloading data for offline use. Please do not exit the app until download has finished.'
                    : ''
            }
        >
            <BookmarksWrapper>
                <>
                    <ButtonsWrapper>
                        {offlineState == true ? (
                            <>
                                <Button>Finish offline</Button>
                                <Button color="danger" onClick={cancelOffline}>
                                    Cancel offline
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button onClick={startOffline}>
                                    Start offline
                                </Button>
                                <Button onClick={cancelOffline}>
                                    Delete bookmarks
                                </Button>
                            </>
                        )}
                    </ButtonsWrapper>
                    {currentBookmarks
                        ? currentBookmarks.bookmarkedMcPkgs.length > 0 && (
                              <>
                                  <h5>MC package bookmarks</h5>
                                  <BookmarkableEntityInfoList
                                      searchType={SearchType.MC}
                                      isBookmarked={isBookmarked}
                                      handleBookmarkClicked={
                                          handleBookmarkClicked
                                      }
                                      entityInfoList={
                                          currentBookmarks?.bookmarkedMcPkgs
                                      }
                                      offlinePlanningState={!offlineState}
                                  />
                              </>
                          )
                        : null}
                    {currentBookmarks
                        ? currentBookmarks.bookmarkedTags.length > 0 && (
                              <>
                                  <h5>Tag bookmarks</h5>
                                  <BookmarkableEntityInfoList
                                      searchType={SearchType.Tag}
                                      isBookmarked={isBookmarked}
                                      handleBookmarkClicked={
                                          handleBookmarkClicked
                                      }
                                      entityInfoList={
                                          currentBookmarks?.bookmarkedTags
                                      }
                                      offlinePlanningState={!offlineState}
                                  />
                              </>
                          )
                        : null}
                    {currentBookmarks
                        ? currentBookmarks.bookmarkedWorkOrders.length > 0 && (
                              <>
                                  <h5>Work order bookmarks</h5>
                                  <BookmarkableEntityInfoList
                                      searchType={SearchType.WO}
                                      isBookmarked={isBookmarked}
                                      handleBookmarkClicked={
                                          handleBookmarkClicked
                                      }
                                      entityInfoList={
                                          currentBookmarks?.bookmarkedWorkOrders
                                      }
                                      offlinePlanningState={!offlineState}
                                  />
                              </>
                          )
                        : null}
                    {currentBookmarks
                        ? currentBookmarks.bookmarkedPurchaseOrders.length >
                              0 && (
                              <>
                                  <h5>Purchase order bookmarks</h5>
                                  <BookmarkableEntityInfoList
                                      searchType={SearchType.PO}
                                      isBookmarked={isBookmarked}
                                      handleBookmarkClicked={
                                          handleBookmarkClicked
                                      }
                                      entityInfoList={
                                          currentBookmarks?.bookmarkedPurchaseOrders
                                      }
                                      offlinePlanningState={!offlineState}
                                  />
                              </>
                          )
                        : null}
                </>
            </BookmarksWrapper>
        </AsyncPage>
    );
};

export default Bookmarks;
