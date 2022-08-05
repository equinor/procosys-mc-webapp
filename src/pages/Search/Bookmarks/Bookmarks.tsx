import React, { useContext, useState } from 'react';
import withAccessControl from '../../../services/withAccessControl';
import styled from 'styled-components';
import { Banner } from '@equinor/eds-core-react';
import {
    Navbar,
    ProcosysButton,
    useSnackbar,
    NavigationFooter,
    FooterButton,
    removeSubdirectories,
} from '@equinor/procosys-webapp-components';
import SideMenu from '../../../components/navigation/SideMenu';
import useCommonHooks from '../../../utils/useCommonHooks';
import { COLORS } from '../../../style/GlobalStyles';
import EdsIcon from '../../../components/icons/EdsIcon';
import PlantContext from '../../../contexts/PlantContext';
import { getCurrentBookmarks } from '../../../utils/useBookmarks';
import EntityPageDetailsCard from '../../Entity/EntityPageDetailsCard';
import {
    McPkgPreview,
    WoPreview,
    Tag,
    PoPreview,
} from '../../../services/apiTypes';
import { AsyncStatus } from '../../../contexts/McAppContext';

const OfflineBookmarkPageWrapper = styled.main`
    padding: 0 4%;
    margin: 0;
    & > p {
        margin: 0;
        padding: 16px 0;
    }
`;

const OfflineBanner = styled.div`
    background: ${COLORS.mossGreen};
    color: white;
    text-align: center;
    font-weight: bold;
`;

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
    const { currentProject } = useContext(PlantContext);
    const [details, setDetails] = useState<
        McPkgPreview | WoPreview | Tag | PoPreview
    >();
    const [fetchDetailsStatus, setFetchDetailsStatus] = useState(
        AsyncStatus.LOADING
    );

    // TODO: finish once backend is ready

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
                    <>
                        {bookmarks.map((bookmark) => (
                            <EntityPageDetailsCard
                                key={bookmark}
                                fetchDetailsStatus={fetchDetailsStatus}
                                details={details}
                            />
                        ))}
                    </>
                )}
            </BookmarksWrapper>
        </>
    );
};

export default withAccessControl(OfflineBookmark, [
    'MCPKG/READ',
    'WO/READ',
    'TAG/READ',
    'PURCHASEORDER/READ',
]);
