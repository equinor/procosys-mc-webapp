import React from 'react';
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

const SearchPage = (): JSX.Element => {
    const { snackbar, setSnackbarText } = useSnackbar();
    const { history, url, path } = useCommonHooks();

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
                        path={`${path}/bookmarks`}
                        render={(): JSX.Element => <Bookmarks />}
                    />
                </Switch>
                {snackbar}
            </SearchPageWrapper>
            <NavigationFooter>
                <FooterButton
                    active={!history.location.pathname.includes('/bookmarks')}
                    goTo={(): void => history.push(`${url}`)}
                    icon={<EdsIcon name="search" color={COLORS.mossGreen} />}
                    label="Search"
                />
                <FooterButton
                    active={history.location.pathname.includes('/bookmarks')}
                    goTo={(): void => history.push(`${url}/bookmarks`)}
                    icon={
                        <EdsIcon
                            name="bookmark_outlined"
                            color={COLORS.mossGreen}
                        />
                    }
                    label={'Offline bookmarks'}
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
