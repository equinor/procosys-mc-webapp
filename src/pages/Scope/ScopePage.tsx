import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Scope from './Scope/Scope';
import PunchList from './PunchList/PunchList';
import Navbar from '../../components/navigation/Navbar';
import styled from 'styled-components';
import useCommonHooks from '../../utils/useCommonHooks';
import { AsyncStatus } from '../../contexts/McAppContext';
import {
    ChecklistPreview,
    PunchPreview,
    McPkgPreview,
} from '../../services/apiTypes';
import { DotProgress } from '@equinor/eds-core-react';
import NavigationFooterShell from '../../components/navigation/NavigationFooterShell';
import withAccessControl from '../../services/withAccessControl';
import Axios from 'axios';
import NavigationFooter from '../../components/navigation/NavigationFooter';
import FooterButton from '../../components/navigation/FooterButton';
import EdsIcon from '../../components/icons/EdsIcon';
import { COLORS } from '../../style/GlobalStyles';
import SearchResult from '../../components/detailCards/McDetails';

const ScopePageWrapper = styled.main``;

const DetailsWrapper = styled.p`
    text-align: center;
    padding: 12px;
`;

const ContentWrapper = styled.div`
    padding: 0 4%;
`;

const ScopePage = (): JSX.Element => {
    const { api, params, path, history, url } = useCommonHooks();
    const [scope, setScope] = useState<ChecklistPreview[]>();
    const [punchList, setPunchList] = useState<PunchPreview[]>();
    const [details, setDetails] = useState<McPkgPreview>();
    const [fetchStatus, setFetchStatus] = useState(AsyncStatus.LOADING);

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
                        params.itemId,
                        source.token
                    ),
                    api.getPunchList(
                        params.plant,
                        params.searchType,
                        params.itemId,
                        source.token
                    ),
                    api.getItemDetails(
                        params.plant,
                        params.searchType,
                        params.itemId,
                        source.token
                    ),
                ]);
                setScope(scopeFromApi);
                setPunchList(punchListFromApi);
                setDetails(detailsFromApi);
                setFetchStatus(AsyncStatus.SUCCESS);
            } catch {
                setFetchStatus(AsyncStatus.ERROR);
            }
        })();
        return (): void => {
            source.cancel();
        };
    }, [api, params.plant, params.searchType, params.itemId]);

    const determineDetailsToRender = (): JSX.Element => {
        if (fetchStatus === AsyncStatus.SUCCESS && details != undefined) {
            return (
                <SearchResult
                    key={details.id}
                    searchResult={details}
                    searchType={params.searchType}
                    clickable={false}
                />
            );
        }
        if (fetchStatus === AsyncStatus.ERROR) {
            return (
                <DetailsWrapper>
                    Unable to load details. Please reload
                </DetailsWrapper>
            );
        }
        return (
            <DetailsWrapper>
                <DotProgress color="primary" />
            </DetailsWrapper>
        );
    };

    const determineFooterToRender = (): JSX.Element => {
        if (fetchStatus === AsyncStatus.SUCCESS && scope && punchList) {
            return (
                <NavigationFooter>
                    <FooterButton
                        active={
                            !history.location.pathname.includes('/punch-list')
                        }
                        goTo={(): void => history.push(url)}
                        icon={<EdsIcon name="list" color={COLORS.mossGreen} />}
                        label="Scope"
                        numberOfItems={scope.length}
                    />
                    <FooterButton
                        active={history.location.pathname.includes(
                            '/punch-list'
                        )}
                        goTo={(): void => history.push(`${url}/punch-list`)}
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
        if (fetchStatus === AsyncStatus.ERROR) {
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
            <Navbar
                noBorder
                leftContent={{ name: 'back', label: 'Search' }}
                midContent={params.searchType}
            />
            {determineDetailsToRender()}
            <ContentWrapper>
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
            </ContentWrapper>
            {determineFooterToRender()}
        </ScopePageWrapper>
    );
};

export default withAccessControl(ScopePage, [
    'MCPKG/READ',
    'MCCR/READ',
    'PUNCHLISTITEM/READ',
]);
