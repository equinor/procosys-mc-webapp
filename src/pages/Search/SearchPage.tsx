import React, { useContext } from 'react';
import withAccessControl from '../../services/withAccessControl';
import styled from 'styled-components';
import {
    Navbar,
    ProcosysButton,
    useSnackbar,
    NavigationFooter,
    FooterButton,
} from '@equinor/procosys-webapp-components';
import SideMenu from '../../components/navigation/SideMenu';
import { Switch as SwitchButton } from '@equinor/eds-core-react';
import useCommonHooks from '../../utils/useCommonHooks';
import { COLORS } from '../../style/GlobalStyles';
import EdsIcon from '../../components/icons/EdsIcon';
import { Route, Switch } from 'react-router-dom';
import PlantContext from '../../contexts/PlantContext';
import Bookmarks from './Bookmarks/Bookmarks';
import Search from './Search';

const SearchPageWrapper = styled.main`
    padding: 0 4%;
    margin: 0;
    & > p {
        margin: 0;
        padding: 16px 0;
    }
`;

export enum SearchType {
    PO = 'PO',
    MC = 'MC',
    WO = 'WO',
    Tag = 'Tag',
}

const SearchPage = (): JSX.Element => {
    const { snackbar, setSnackbarText } = useSnackbar();
    const { offlineState, setOfflineState, history, url, path } =
        useCommonHooks();
    // TODO: use useBookmarks to get current bookmarks

    return (
        <>
            <SearchPageWrapper>
                <Navbar
                    leftContent={<ProcosysButton />}
                    rightContent={<SideMenu />}
                />
                <Switch>
                    <Route
                        exact
                        path={`${path}`}
                        render={(): JSX.Element => (
                            <Search setSnackbarText={setSnackbarText} />
                        )}
                    />
                    <Route
                        exact
                        path={`${path}/tag-info`}
                        render={(): JSX.Element => <Bookmarks bookmarks={1} />} // TODO: finish
                    />
                </Switch>
                <SwitchButton // TODO: move
                    label={
                        offlineState
                            ? 'Deactivate offline mode'
                            : 'Activate offline mode'
                    }
                    onChange={(): void => {
                        setOfflineState((prev) => !prev);
                    }}
                    checked={offlineState ? true : false}
                />

                {snackbar}
            </SearchPageWrapper>
            <NavigationFooter>
                <FooterButton
                    active={!history.location.pathname.includes('/bookmark')}
                    goTo={(): void => history.push(url)}
                    icon={<EdsIcon name="search" color={COLORS.mossGreen} />}
                    label="Search"
                />
                <FooterButton
                    active={history.location.pathname.includes('/bookmark')}
                    goTo={(): void => history.push(`${url}/bookmark`)}
                    icon={
                        <EdsIcon
                            name="bookmark_outlined"
                            color={COLORS.mossGreen}
                        />
                    }
                    label={'Offline bookmarks'}
                    numberOfItems={1} // TODO: fix
                />
            </NavigationFooter>
        </>
    );
};

export default withAccessControl(SearchPage, [
    'MCPKG/READ',
    'WO/READ',
    'TAG/READ',
    'PURCHASEORDER/READ',
]);
