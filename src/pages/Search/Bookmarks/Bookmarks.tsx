import React, { useState } from 'react';
import styled from 'styled-components';
import { Banner } from '@equinor/eds-core-react';
import { COLORS } from '../../../style/GlobalStyles';
import EdsIcon from '../../../components/icons/EdsIcon';
import {
    McPkgPreview,
    WoPreview,
    Tag,
    PoPreview,
} from '../../../services/apiTypes';
import { AsyncStatus } from '../../../contexts/McAppContext';
import useBookmarks from '../../../utils/useBookmarks';
import BookmarkableEntityInfoList from '../BookmarkableEntityInfoList';

const BookmarksWrapper = styled.div`
    margin: 16px 0;
`;

export enum SearchType {
    PO = 'PO',
    MC = 'MC',
    WO = 'WO',
    Tag = 'Tag',
}

const Bookmarks = (): JSX.Element => {
    const {
        currentBookmarks,
        fetchBookmarksStatus,
        isBookmarked,
        handleBookmarkClicked,
    } = useBookmarks();

    return (
        <>
            <BookmarksWrapper>
                {fetchBookmarksStatus == AsyncStatus.EMPTY_RESPONSE ? (
                    <Banner>
                        <Banner.Icon>
                            <EdsIcon
                                name={'info_circle'}
                                color={COLORS.mossGreen}
                            />
                        </Banner.Icon>
                        <Banner.Message role={'paragraph'}>
                            You haven`&apos;`t started adding offline bookmarks
                        </Banner.Message>
                    </Banner>
                ) : (
                    // TODO: style
                    // TODO: add buttons
                    <>
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
                                      />
                                  </>
                              )
                            : null}
                        {currentBookmarks
                            ? currentBookmarks.bookmarkedWorkOrders.length >
                                  0 && (
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
                                      />
                                  </>
                              )
                            : null}
                    </>
                )}
            </BookmarksWrapper>
        </>
    );
};

export default Bookmarks;
