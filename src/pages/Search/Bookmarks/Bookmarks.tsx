import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { Button, Checkbox, Scrim } from '@equinor/eds-core-react';
import useBookmarks from '../../../utils/useBookmarks';
import BookmarkableEntityInfoList from '../BookmarkableEntityInfoList';
import { SearchType } from '../../../typings/enums';
import useCommonHooks from '../../../utils/useCommonHooks';
import AsyncPage from '../../../components/AsyncPage';
import { COLORS, SHADOW } from '../../../style/GlobalStyles';
import { AsyncStatus } from '@equinor/procosys-webapp-components';
import PlantContext from '../../../contexts/PlantContext';

const CancellingPopup = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    background-color: ${COLORS.white};
    padding: 16px;
    margin: 0 16px;
    box-shadow: ${SHADOW};
`;

const ButtonsWrapper = styled.div`
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
        isDownloading,
        finishOffline,
    } = useBookmarks();
    const { offlineState } = useCommonHooks();
    const [isCancelling, setIsCancelling] = useState<boolean>(false);
    const [isSure, setIsSure] = useState<boolean>(false);

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
                {isCancelling ? (
                    <Scrim
                        isDismissable
                        onClose={(): void => setIsCancelling(false)}
                    >
                        <CancellingPopup>
                            <h3>Do you really wish to cancel offline mode?</h3>
                            <Checkbox
                                label="I understand that cancelling offline mode deletes all my offline changes"
                                onClick={(): void => setIsSure(true)}
                            />
                            <ButtonsWrapper>
                                <Button
                                    variant={'outlined'}
                                    onClick={(): void => setIsCancelling(false)}
                                >
                                    Don&apos;t cancel
                                </Button>
                                <Button
                                    color={'danger'}
                                    disabled={
                                        bookmarksStatus ===
                                            AsyncStatus.LOADING || !isSure
                                    }
                                    onClick={cancelOffline}
                                    aria-label="Delete"
                                >
                                    Yes, cancel offline
                                </Button>
                            </ButtonsWrapper>
                        </CancellingPopup>
                    </Scrim>
                ) : null}
                <ButtonsWrapper>
                    {offlineState == true ? (
                        <>
                            <Button onClick={finishOffline}>
                                Finish offline
                            </Button>
                            <Button onClick={cancelOffline}>
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
