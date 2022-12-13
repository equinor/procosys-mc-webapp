import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Scrim } from '@equinor/eds-core-react';
import useBookmarks, { OfflineAction } from '../../../utils/useBookmarks';
import BookmarkableEntityInfoList from '../BookmarkableEntityInfoList';
import { OfflineStatus, SearchType } from '../../../typings/enums';
import useCommonHooks from '../../../utils/useCommonHooks';
import AsyncPage from '../../../components/AsyncPage';
import BookmarksPopUps, { BookmarksPopup } from './BookmarksPopups';
import { OfflineSynchronizationErrors } from '../../../services/apiTypes';
import { isOfType } from '@equinor/procosys-webapp-components';

export const ButtonsWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding-top: 16px;
`;

const ErrorContainer = styled.div`
    display: flex;
    & > div {
        width: 50%;
    }
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
    const { offlineState } = useCommonHooks();
    const [noNetworkConnection, setNoNetworkConnection] =
        useState<boolean>(false);
    const [syncErrors, setSyncErrors] =
        useState<OfflineSynchronizationErrors | null>(null);
    const [errorPopupOpen, setErrorPopupOpen] = useState<boolean>(true);

    useEffect(() => {
        const errors = localStorage.getItem('SynchErrors');
        if (errors != null) {
            try {
                const errorsObject = JSON.parse(errors);
                if (
                    isOfType<OfflineSynchronizationErrors>(
                        errorsObject,
                        'CheckListErrors'
                    )
                ) {
                    setSyncErrors(errorsObject);
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        }
        setSyncErrors(null);
    }, [offlineState]);

    const startSync = (): void => {
        if (navigator.onLine) {
            setNoNetworkConnection(false);
            finishOffline();
        } else {
            setNoNetworkConnection(true);
        }
    };

    const getLoadingMessage = (): string => {
        if (offlineAction == OfflineAction.DOWNLOADING) {
            return 'Downloading data for offline use. Please do not exit the app until the download has finished.';
        } else if (offlineState == OfflineStatus.SYNCHING) {
            return 'Synching offline changes. Please do not exit the app until the upload has finished.';
        } else {
            return '';
        }
    };

    return (
        <>
            {offlineState == OfflineStatus.ONLINE &&
            syncErrors != null &&
            errorPopupOpen ? (
                <Scrim
                    isDismissable={true}
                    onClose={(): void => setErrorPopupOpen(false)}
                >
                    <BookmarksPopup>
                        <h3>Some of your offline changes could not be saved</h3>
                        <p>
                            A list of checklists and punches where at least one
                            change could not be saved is shown below
                        </p>
                        <ErrorContainer>
                            {syncErrors.CheckListErrors.length > 0 ? (
                                <div>
                                    <h4>Checklists</h4>
                                    {syncErrors.CheckListErrors.map((error) => (
                                        <p key={error.Id}>{error.Id}</p>
                                    ))}
                                </div>
                            ) : null}
                            {syncErrors.PunchListItemErrors.length > 0 ? (
                                <div>
                                    <h4>Punches</h4>
                                    {syncErrors.PunchListItemErrors.map(
                                        (error) => (
                                            <p key={error.Id}>{error.Id}</p>
                                        )
                                    )}
                                </div>
                            ) : null}
                        </ErrorContainer>
                        <ButtonsWrapper>
                            <Button
                                onClick={(): void => setErrorPopupOpen(false)}
                            >
                                Close
                            </Button>
                            <Button
                                onClick={(): void => {
                                    localStorage.removeItem('SynchErrors');
                                    setSyncErrors(null);
                                }}
                            >
                                Don&apos;t show this message again
                            </Button>
                        </ButtonsWrapper>
                    </BookmarksPopup>
                </Scrim>
            ) : null}
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
                        {offlineState != OfflineStatus.ONLINE ? (
                            <>
                                <Button onClick={startSync}>
                                    Finish offline
                                </Button>
                                <Button
                                    onClick={(): void =>
                                        setOfflineAction(
                                            OfflineAction.CANCELLING
                                        )
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
                </div>
            </AsyncPage>
        </>
    );
};

export default Bookmarks;
