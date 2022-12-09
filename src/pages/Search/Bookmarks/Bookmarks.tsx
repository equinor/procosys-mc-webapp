import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@equinor/eds-core-react';
import useBookmarks, { OfflineAction } from '../../../utils/useBookmarks';
import BookmarkableEntityInfoList from '../BookmarkableEntityInfoList';
import { SearchType } from '../../../typings/enums';
import useCommonHooks from '../../../utils/useCommonHooks';
import AsyncPage from '../../../components/AsyncPage';
import BookmarksPopUps from './BookmarksPopups';
import hasConnectionToServer from '../../../utils/hasConnectionToServer';

export const ButtonsWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding-top: 16px;
`;

const Bookmarks = (): JSX.Element => {
    const {
        currentBookmarks,
        bookmarksStatus,
        isBookmarked,
        handleBookmarkClicked,
        cancelOffline,
        startOffline,
        finishOffline,
        deleteBookmarks,
        setUserPin,
        offlineAction,
        setOfflineAction,
    } = useBookmarks();
    const { offlineState, api } = useCommonHooks();
    const [noNetworkConnection, setNoNetworkConnection] =
        useState<boolean>(false);

    const startSync = async (): Promise<void> => {
        const connection = await hasConnectionToServer(api);
        if (connection) {
            setNoNetworkConnection(false);
            finishOffline();
        } else {
            setNoNetworkConnection(true);
        }
    };

    const getLoadingMessage = (): string => {
        if (offlineAction == OfflineAction.DOWNLOADING) {
            return 'Downloading data for offline use. Please do not exit the app until the download has finished.';
        } else if (offlineAction == OfflineAction.SYNCHING) {
            return 'Synching offline changes. Please do not exit the app until the upload has finished.';
        } else {
            return '';
        }
    };

    return (
        <AsyncPage
            fetchStatus={bookmarksStatus}
            emptyContentMessage={"You don't have any offline bookmarks"}
            errorMessage={
                "Couldn't get bookmarks, please reload page to try again"
            }
            loadingMessage={getLoadingMessage()}
        >
            <div>
                <BookmarksPopUps
                    offlineAction={offlineAction}
                    setOfflineAction={setOfflineAction}
                    setUserPin={setUserPin}
                    startOffline={startOffline}
                    bookmarksStatus={bookmarksStatus}
                    cancelOffline={cancelOffline}
                    noNetworkConnection={noNetworkConnection}
                    setNoNetworkConnection={setNoNetworkConnection}
                    startSync={startSync}
                />
                <ButtonsWrapper>
                    {offlineState == true ? (
                        <>
                            <Button onClick={startSync}>Finish offline</Button>
                            <Button
                                onClick={(): void =>
                                    setOfflineAction(OfflineAction.CANCELLING)
                                }
                                color="danger"
                            >
                                Cancel offline
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                onClick={(): void =>
                                    setOfflineAction(OfflineAction.STARTING)
                                }
                            >
                                Start offline
                            </Button>
                            <Button onClick={deleteBookmarks}>
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
                                  handleBookmarkClicked={handleBookmarkClicked}
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
                                  handleBookmarkClicked={handleBookmarkClicked}
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
                                  handleBookmarkClicked={handleBookmarkClicked}
                                  entityInfoList={
                                      currentBookmarks?.bookmarkedWorkOrders
                                  }
                                  offlinePlanningState={!offlineState}
                              />
                          </>
                      )
                    : null}
                {currentBookmarks
                    ? currentBookmarks.bookmarkedPurchaseOrders.length > 0 && (
                          <>
                              <h5>Purchase order bookmarks</h5>
                              <BookmarkableEntityInfoList
                                  searchType={SearchType.PO}
                                  isBookmarked={isBookmarked}
                                  handleBookmarkClicked={handleBookmarkClicked}
                                  entityInfoList={
                                      currentBookmarks?.bookmarkedPurchaseOrders
                                  }
                                  offlinePlanningState={!offlineState}
                              />
                          </>
                      )
                    : null}
            </div>
        </AsyncPage>
    );
};

export default Bookmarks;
