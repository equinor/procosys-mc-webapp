import React, { useState } from 'react';
import withAccessControl from '../../services/withAccessControl';
import styled from 'styled-components';
import { Banner } from '@equinor/eds-core-react';
import {
    Navbar,
    ProcosysButton,
    NavigationFooter,
    FooterButton,
    removeSubdirectories,
} from '@equinor/procosys-webapp-components';
import SideMenu from '../../components/navigation/SideMenu';
import useCommonHooks from '../../utils/useCommonHooks';
import { COLORS } from '../../style/GlobalStyles';
import EdsIcon from '../../components/icons/EdsIcon';
import { AsyncStatus } from '../../contexts/McAppContext';

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

export enum SearchType {
    PO = 'PO',
    MC = 'MC',
    WO = 'WO',
    Tag = 'Tag',
}

const Bookmarks = (): JSX.Element => {
    const { offlineState, history, url, api, params } = useCommonHooks();
    const [postBookmarkStatus, setPostBookmarkStatus] = useState(
        AsyncStatus.INACTIVE
    );

    const handleGetBookmarks = async (): Promise<void> => {
        setPostBookmarkStatus(AsyncStatus.LOADING);
        try {
            await api.getBookmarks(
                params.plant,
                params.searchType,
                params.entityId
            );
            setPostBookmarkStatus(AsyncStatus.SUCCESS);
        } catch (error) {
            if (!(error instanceof Error)) return;
            setPostBookmarkStatus(AsyncStatus.ERROR);
        }
    };

    const handleDeleteAllBookmarks = async (): Promise<void> => {
        setPostBookmarkStatus(AsyncStatus.LOADING);
        try {
            await api.deleteAllBookmarks(
                params.plant,
                params.searchType,
                params.entityId
            );
            setPostBookmarkStatus(AsyncStatus.SUCCESS);
        } catch (error) {
            if (!(error instanceof Error)) return;
            setPostBookmarkStatus(AsyncStatus.ERROR);
        }
    };

    return (
        <>
            <OfflineBanner>
                {offlineState ? 'Offline mode active' : undefined}
            </OfflineBanner>
            <OfflineBookmarkPageWrapper>
                <Navbar
                    leftContent={<ProcosysButton />}
                    rightContent={<SideMenu />}
                />

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

                <p>PO</p>

                <p>MC</p>

                <p>WO</p>

                <p>Tag</p>
            </OfflineBookmarkPageWrapper>
            <NavigationFooter>
                <FooterButton
                    active={!history.location.pathname.includes('/bookmark')}
                    goTo={(): void =>
                        history.push(`${removeSubdirectories(url, 1)}`)
                    }
                    icon={<EdsIcon name="search" color={COLORS.mossGreen} />}
                    label="Search"
                />
                <FooterButton
                    active={history.location.pathname.includes('/bookmark')}
                    goTo={(): void => history.push(url)}
                    icon={
                        <EdsIcon
                            name="bookmark_outlined"
                            color={COLORS.mossGreen}
                        />
                    }
                    label={'Offline bookmarks'}
                    numberOfItems={2}
                />
            </NavigationFooter>
        </>
    );
};

export default withAccessControl(Bookmarks, [
    'MCPKG/READ',
    'WO/READ',
    'TAG/READ',
    'PURCHASEORDER/READ',
]);
