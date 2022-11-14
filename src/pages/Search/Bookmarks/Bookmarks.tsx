import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Checkbox, Input, Label, Scrim } from '@equinor/eds-core-react';
import useBookmarks from '../../../utils/useBookmarks';
import BookmarkableEntityInfoList from '../BookmarkableEntityInfoList';
import { SearchType } from '../../../typings/enums';
import useCommonHooks from '../../../utils/useCommonHooks';
import AsyncPage from '../../../components/AsyncPage';
import { COLORS, SHADOW } from '../../../style/GlobalStyles';
import { AsyncStatus } from '@equinor/procosys-webapp-components';
import BookmarksPopUps from './BookmarksPopups';

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
        isDownloading,
        finishOffline,
        deleteBookmarks,
        isCancelling,
        setIsCancelling,
        cancelOffline,
        isStarting,
        setIsStarting,
        startOffline,
        setUserPin,
    } = useBookmarks();
    const { offlineState } = useCommonHooks();
    const [noNetworkConnection, setNoNetworkConnection] =
        useState<boolean>(false);

    const startSync = (): void => {
        if (navigator.onLine) {
            setNoNetworkConnection(false);
            finishOffline();
        } else {
            setNoNetworkConnection(true);
        }
    };

    return (
        <AsyncPage
            fetchStatus={bookmarksStatus}
            emptyContentMessage={"You don't have any offline bookmarks"}
            errorMessage={
                "Couldn't get bookmarks, please reload page to try again"
            }
            loadingMessage={
                isDownloading
                    ? 'Downloading data for offline use. Please do not exit the app until the download has finished.'
                    : ''
            }
        >
            <div>
                <BookmarksPopUps
                    isStarting={isStarting}
                    setIsStarting={setIsStarting}
                    setUserPin={setUserPin}
                    startOffline={startOffline}
                    isCancelling={isCancelling}
                    setIsCancelling={setIsCancelling}
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
                                onClick={(): void => setIsCancelling(true)}
                                color="danger"
                            >
                                Cancel offline
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={(): void => setIsStarting(true)}>
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
