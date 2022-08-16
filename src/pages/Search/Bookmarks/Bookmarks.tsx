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

const BookmarksWrapper = styled.div`
    margin: 16px 0;
`;

export enum SearchType {
    PO = 'PO',
    MC = 'MC',
    WO = 'WO',
    Tag = 'Tag',
}

interface OfflineBookmarkProps {
    bookmarks: any;
}

const OfflineBookmark = ({ bookmarks }: OfflineBookmarkProps): JSX.Element => {
    // TODO: finish once backend is ready
    // TODO: should the bookmarks be passed into this component?

    return (
        <>
            <BookmarksWrapper>
                {bookmarks.length < 1 ? (
                    <Banner>
                        <Banner.Icon>
                            <EdsIcon
                                name={'info_circle'}
                                color={COLORS.mossGreen}
                            />
                        </Banner.Icon>
                        <Banner.Message role={'paragraph'}>
                            The bookmark list is empty
                        </Banner.Message>
                    </Banner>
                ) : (
                    <></> // todo: list the bookmarks
                )}
            </BookmarksWrapper>
        </>
    );
};

export default OfflineBookmark;
