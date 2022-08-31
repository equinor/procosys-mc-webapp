import React, { useContext } from 'react';
import styled from 'styled-components';
import { Banner, Button } from '@equinor/eds-core-react';
import { COLORS } from '../../../style/GlobalStyles';
import EdsIcon from '../../../components/icons/EdsIcon';
import { AsyncStatus } from '../../../contexts/McAppContext';
import useBookmarks from '../../../utils/useBookmarks';
import BookmarkableEntityInfoList from '../BookmarkableEntityInfoList';
import { SearchType } from '../../../typings/enums';
import useCommonHooks from '../../../utils/useCommonHooks';
import buildOfflineScope from '../../../database/buildOfflineScope';
import PlantContext from '../../../contexts/PlantContext';
import { OfflineContentRepository } from '../../../database/OfflineContentRepository';
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
        fetchBookmarksStatus,
        isBookmarked,
        handleBookmarkClicked,
        cancelOffline,
    } = useBookmarks();

    const { currentPlant, currentProject } = useContext(PlantContext);
    const { api, offlineState, setOfflineState } = useCommonHooks();

    const startOffline = async (): Promise<void> => {
        const offlineContentRepository = new OfflineContentRepository();
        offlineContentRepository.cleanOfflineContent();
        if (currentPlant && currentProject) {
            await buildOfflineScope(api, currentPlant.slug, currentProject.id);
        }
        setOfflineState(true);
    };

    return (
        <AsyncPage
            fetchStatus={fetchBookmarksStatus}
            emptyContentMessage={"You don't have any offline bookmarks"}
            errorMessage={
                'Couldn&apos;t get bookmarks, please reload page to try again'
            }
        >
            <BookmarksWrapper>
                <>
                    <ButtonsWrapper>
                        {offlineState == true ? (
                            <>
                                <Button>Finish offline</Button>
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
                                    Delete all
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
