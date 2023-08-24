import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { Button } from '@equinor/eds-core-react';
import useBookmarks, { OfflineAction } from '../../../utils/useBookmarks';
import BookmarkableEntityInfoList from '../BookmarkableEntityInfoList';
import { OfflineScopeStatus } from '../../../typings/enums';
import useCommonHooks from '../../../utils/useCommonHooks';
import AsyncPage from '../../../components/AsyncPage';
import BookmarksPopUps from './BookmarksPopups';
import hasConnectionToServer from '../../../utils/hasConnectionToServer';
import { OfflineStatus, SearchType } from '@equinor/procosys-webapp-components';
import PlantContext from '../../../contexts/PlantContext';

export const ButtonsWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding-top: 16px;
`;

interface BookmarksProps {
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
}

const Bookmarks = ({ setSnackbarText }: BookmarksProps): JSX.Element => {
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
        tryStartOffline,
        getCurrentBookmarks,
    } = useBookmarks({ setSnackbarText });
    const { offlineState, api, featureFlags, params } = useCommonHooks();
    const [noNetworkConnection, setNoNetworkConnection] =
        useState<boolean>(false);
    const { currentProject } = useContext(PlantContext);

    const startSync = async (): Promise<void> => {
        const connection = await hasConnectionToServer(api);
        if (connection) {
            setNoNetworkConnection(false);
            await finishOffline();
        } else {
            setNoNetworkConnection(true);
        }
    };

    const getLoadingMessage = (): string => {
        if (offlineAction == OfflineAction.DOWNLOADING) {
            return 'Downloading data for offline use. Please do not exit the app until the download has finished.';
        } else {
            return '';
        }
    };

    const disableActions = (): boolean => {
        if (offlineState == OfflineStatus.SYNC_FAIL) {
            return true;
        }
        return false;
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
                    bookmarks={currentBookmarks}
                    tryStartOffline={tryStartOffline}
                />

                <ButtonsWrapper>
                    {featureFlags.offlineFunctionalityIsEnabled == true ? (
                        <>
                            {offlineState != OfflineStatus.ONLINE ? (
                                <>
                                    <Button
                                        onClick={startSync}
                                        disabled={disableActions()}
                                    >
                                        Stop offline mode
                                    </Button>
                                    <Button
                                        onClick={(): void =>
                                            setOfflineAction(
                                                OfflineAction.CANCELLING
                                            )
                                        }
                                        disabled={disableActions()}
                                        color="danger"
                                    >
                                        Cancel offline mode
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        onClick={async (): Promise<void> => {
                                            if (currentProject) {
                                                await getCurrentBookmarks();
                                                currentBookmarks?.openDefinition
                                                    .status ==
                                                OfflineScopeStatus.UNDER_PLANNING
                                                    ? setOfflineAction(
                                                          OfflineAction.STARTING
                                                      )
                                                    : setOfflineAction(
                                                          OfflineAction.TRYING_STARTING
                                                      );
                                            }
                                        }}
                                    >
                                        Start offline mode
                                    </Button>
                                    <Button onClick={deleteBookmarks}>
                                        Delete bookmarks
                                    </Button>
                                </>
                            )}
                        </>
                    ) : (
                        <Button onClick={deleteBookmarks}>
                            Delete bookmarks
                        </Button>
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
