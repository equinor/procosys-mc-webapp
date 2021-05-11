import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Scope from './Scope/Scope';
import Tasks from './Tasks/Tasks';
import PunchList from './PunchList/PunchList';
import Navbar from '../../components/navigation/Navbar';
import styled from 'styled-components';
import useCommonHooks from '../../utils/useCommonHooks';
import { AsyncStatus } from '../../contexts/McAppContext';
import {
    ChecklistPreview,
    TaskPreview,
    PunchPreview,
    McPkgPreview,
} from '../../services/apiTypes';
import { DotProgress } from '@equinor/eds-core-react';
import NavigationFooterShell from '../../components/navigation/NavigationFooterShell';
import withAccessControl from '../../services/withAccessControl';
import Axios from 'axios';
import calculateHighestStatus from '../../utils/calculateHighestStatus';
import NavigationFooter from '../../components/navigation/NavigationFooter';
import FooterButton from '../../components/navigation/FooterButton';
import EdsIcon from '../../components/icons/EdsIcon';
import { COLORS } from '../../style/GlobalStyles';
import { SearchType } from '../Search/Search';
import SearchResult from '../Search/SearchResults/SearchResult';

// TODO: rename everything Comm pkg related

const ScopePageWrapper = styled.main``;

const ScopePage = (): JSX.Element => {
    const { api, params, path, history, url } = useCommonHooks();
    const [scope, setScope] = useState<ChecklistPreview[]>();
    const [punchList, setPunchList] = useState<PunchPreview[]>();
    const [details, setDetails] = useState<McPkgPreview>();
    // TODO: rename & also use in the result card thingy, like in the details card
    const [fetchFooterDataStatus, setFetchFooterDataStatus] = useState(
        AsyncStatus.LOADING
    );

    useEffect(() => {
        const source = Axios.CancelToken.source();
        (async (): Promise<void> => {
            try {
                const [
                    scopeFromApi,
                    punchListFromApi,
                    detailsFromApi,
                ] = await Promise.all([
                    api.getScope(
                        params.plant,
                        params.searchType,
                        params.itemId
                    ),
                    api.getPunchList(
                        params.plant,
                        params.searchType,
                        params.itemId
                    ),
                    api.getItemDetails(
                        params.plant,
                        params.searchType,
                        params.itemId
                    ),
                ]);
                setScope(scopeFromApi);
                setPunchList(punchListFromApi);
                setDetails(detailsFromApi);
                setFetchFooterDataStatus(AsyncStatus.SUCCESS);
            } catch {
                setFetchFooterDataStatus(AsyncStatus.ERROR);
            }
        })();
        return (): void => {
            source.cancel();
        };
    }, [api, params.plant, params.searchType, params.itemId]);

    const determinePageTitle = (): string => {
        if (params.searchType === SearchType.MC) return 'MC package';
        return '';
    };

    const determineDetailsToRender = (): JSX.Element => {
        if (details != undefined) {
            return (
                <SearchResult
                    key={details.id}
                    searchResult={details}
                    searchType={params.searchType}
                    clickable={false}
                />
            );
        }
        return <p>Unable to load details. Please reload</p>;
    };

    const determineFooterToRender = (): JSX.Element => {
        if (
            fetchFooterDataStatus === AsyncStatus.SUCCESS &&
            scope &&
            punchList
        ) {
            return (
                <NavigationFooter>
                    <FooterButton
                        active={
                            !history.location.pathname.includes('/punch-list')
                        }
                        goTo={(): void => history.push(url)} // TODO: possibly change url after meeting about it
                        icon={<EdsIcon name="list" color={COLORS.mossGreen} />}
                        label="Scope"
                        numberOfItems={scope.length}
                    />
                    <FooterButton
                        active={history.location.pathname.includes(
                            '/punch-list'
                        )}
                        goTo={(): void => history.push(`${url}/punch-list`)} // TODO: possibly change after meeting
                        icon={
                            <EdsIcon
                                name="warning_filled"
                                color={COLORS.mossGreen}
                            />
                        }
                        label="Punch list"
                        numberOfItems={punchList.length}
                    />
                </NavigationFooter>
            );
        }
        if (fetchFooterDataStatus === AsyncStatus.ERROR) {
            return (
                <NavigationFooterShell>
                    <p>Unable to load footer. Please reload</p>
                </NavigationFooterShell>
            );
        }
        return (
            <NavigationFooterShell>
                <DotProgress color="primary" />
            </NavigationFooterShell>
        );
    };
    return (
        <ScopePageWrapper>
            {
                // TODO: Should navbar label be Saved Searches or Search?
            }
            <Navbar
                noBorder
                leftContent={{ name: 'back', label: 'Search' }}
                midContent={determinePageTitle()}
            />
            {
                // TODO: check whether its actually the same things in the details in both scope and search results. If not, i'll need to make a new one
            }
            {determineDetailsToRender()}
            {
                <Switch>
                    <Route exact path={`${path}`} component={Scope} />
                    <Route
                        exact
                        path={`${path}/punch-list`}
                        component={PunchList}
                    />
                </Switch>
            }
            {determineFooterToRender()}
        </ScopePageWrapper>
    );
};

// TODO: change access control stuff
export default withAccessControl(ScopePage, ['MCPKG/READ']);
