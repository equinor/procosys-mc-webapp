import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { Button, Checkbox, Input, Scrim } from '@equinor/eds-core-react';
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
        deleteBookmarks,
        isCancelling,
        setIsCancelling,
        isStarting,
        setIsStarting,
    } = useBookmarks();
    const { offlineState } = useCommonHooks();
    const [isSure, setIsSure] = useState<boolean>(false);
    const [enteredPin, setEnteredPin] = useState<number>(0);

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
                {isStarting ? (
                    <Scrim
                        isDismissable
                        onClose={(): void => setIsStarting(false)}
                    >
                        <CancellingPopup>
                            <h3>
                                Input a code to use as your offline password
                            </h3>
                            <Input
                                type="number"
                                value={enteredPin}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ): void => {
                                    setEnteredPin(parseInt(e.target.value));
                                }}
                            />
                            <Checkbox
                                label="I understand that forgetting my pin will result in my offline changes being deleted forever"
                                onClick={(): void => setIsSure(true)}
                            />
                            <ButtonsWrapper>
                                <Button
                                    onClick={(): void => {
                                        startOffline();
                                        setIsSure(false);
                                    }}
                                >
                                    Start offline
                                </Button>
                                <Button
                                    onClick={(): void => {
                                        setIsCancelling(false);
                                        setIsSure(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </ButtonsWrapper>
                        </CancellingPopup>
                    </Scrim>
                ) : null}
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
                                    onClick={(): void => {
                                        setIsCancelling(false);
                                        setIsSure(false);
                                    }}
                                >
                                    Don&apos;t cancel
                                </Button>
                                <Button
                                    color={'danger'}
                                    disabled={
                                        bookmarksStatus ===
                                            AsyncStatus.LOADING || !isSure
                                    }
                                    onClick={(): void => {
                                        cancelOffline();
                                        setIsSure(false);
                                    }}
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
