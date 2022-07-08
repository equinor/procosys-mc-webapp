import React, { useState } from 'react';
import withAccessControl from '../../services/withAccessControl';
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
import SideMenu from '../../components/navigation/SideMenu';
import useCommonHooks from '../../utils/useCommonHooks';
import { COLORS } from '../../style/GlobalStyles';
import EdsIcon from '../../components/icons/EdsIcon';

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

const OfflineBookmark = (): JSX.Element => {
    const { snackbar, setSnackbarText } = useSnackbar();
    const { offlineState, history, url } = useCommonHooks();

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

                {snackbar}
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

export default withAccessControl(OfflineBookmark, [
    'MCPKG/READ',
    'WO/READ',
    'TAG/READ',
    'PURCHASEORDER/READ',
]);
