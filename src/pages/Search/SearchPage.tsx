import React, { useEffect, useState } from 'react';
import withAccessControl from '../../services/withAccessControl';
import styled from 'styled-components';
import {
    Navbar,
    ProcosysButton,
    useSnackbar,
    NavigationFooter,
    FooterButton,
    isOfType,
} from '@equinor/procosys-webapp-components';
import SideMenu from '../../components/navigation/SideMenu';
import useCommonHooks from '../../utils/useCommonHooks';
import { COLORS } from '../../style/GlobalStyles';
import EdsIcon from '../../components/icons/EdsIcon';
import { Route, Switch } from 'react-router-dom';
import Bookmarks from './Bookmarks/Bookmarks';
import Search from './Search';
import { LocalStorage, OfflineStatus } from '../../typings/enums';
import SyncErrors from './SyncErrors';
import { OfflineSynchronizationErrors } from '../../services/apiTypes';

const SearchPageWrapper = styled.main`
    padding: 0;
    margin: 0;
    & > p {
        margin: 0;
        padding: 16px 0;
    }
`;

const ContentWrapper = styled.div`
    padding: 0 4% 66px 4%;
`;

const SearchPage = (): JSX.Element => {
    const { snackbar, setSnackbarText } = useSnackbar();
    const { history, url, path, offlineState } = useCommonHooks();
    const [syncErrors, setSyncErrors] =
        useState<OfflineSynchronizationErrors | null>(null);

    useEffect(() => {
        const errors = localStorage.getItem(LocalStorage.SYNCH_ERRORS);
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
                if (!(error instanceof Error)) return;
                setSnackbarText(error.message);
            }
        }
        setSyncErrors(null);
    }, [offlineState]);

    useEffect(() => {
        if (syncErrors) {
            history.push(`${url}/sync-errors`);
        }
    }, [syncErrors]);

    return (
        <>
            <SearchPageWrapper>
                <Navbar
                    leftContent={<ProcosysButton />}
                    rightContent={<SideMenu />}
                    isOffline={offlineState == OfflineStatus.OFFLINE}
                />
                <ContentWrapper>
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
                            render={(): JSX.Element => (
                                <Bookmarks setSnackbarText={setSnackbarText} />
                            )}
                        />
                        <Route
                            exact
                            path={`${path}/sync-errors`}
                            render={(): JSX.Element => (
                                <SyncErrors
                                    syncErrors={syncErrors}
                                    setSyncErrors={setSyncErrors}
                                    url={url}
                                    setSnackbarText={setSnackbarText}
                                />
                            )}
                        />
                    </Switch>
                    {snackbar}
                </ContentWrapper>
            </SearchPageWrapper>
            <NavigationFooter>
                <FooterButton
                    active={
                        !history.location.pathname.includes('/bookmarks') &&
                        !history.location.pathname.includes('/sync-errors')
                    }
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
                    label={'Bookmarks'}
                />
                {syncErrors != null ? (
                    <FooterButton
                        active={history.location.pathname.includes(
                            '/sync-errors'
                        )}
                        goTo={(): void => history.push(`${url}/sync-errors`)}
                        icon={
                            <EdsIcon
                                name="error_outlined"
                                color={COLORS.mossGreen}
                            />
                        }
                        label="Errors"
                    />
                ) : (
                    <></>
                )}
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
