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
import McDetails from '../../components/detailCards/McDetails';
import { SearchType } from '../Search/Search';

const EntityPageWrapper = styled.main``;

const DetailsWrapper = styled.p`
    text-align: center;
    padding: 12px;
`;

const ContentWrapper = styled.div`
    padding: 0 12px;
`;

const EntityPage = (): JSX.Element => {
    const { api, params, path, history, url } = useCommonHooks();
    const [scope, setScope] = useState<ChecklistPreview[]>();
    const [punchList, setPunchList] = useState<PunchPreview[]>();
    const [details, setDetails] = useState<McPkgPreview>();
    const [fetchFooterStatus, setFetchFooterStatus] = useState(
        AsyncStatus.LOADING
    );
    const [fetchDetailsStatus, setFetchDetailsStatus] = useState(
        AsyncStatus.LOADING
    );
    const source = Axios.CancelToken.source();

    useEffect(() => {
        return (): void => {
            source.cancel();
        };
    }, []);

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const [scopeFromApi, punchListFromApi] = await Promise.all([
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
                ]);
                setScope(scopeFromApi);
                setPunchList(punchListFromApi);
                setFetchFooterStatus(AsyncStatus.SUCCESS);
            } catch {
                setFetchFooterStatus(AsyncStatus.ERROR);
            }
        })();
    }, [api, params]);

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const detailsFromApi = await api.getItemDetails(
                    params.plant,
                    params.searchType,
                    params.itemId,
                    source.token
                );
                setDetails(detailsFromApi);
                setFetchDetailsStatus(AsyncStatus.SUCCESS);
            } catch {
                setFetchDetailsStatus(AsyncStatus.ERROR);
            }
        })();
    }, [api, params]);

    const determineDetailsToRender = (): JSX.Element => {
        if (
            fetchDetailsStatus === AsyncStatus.SUCCESS &&
            details != undefined
        ) {
            if (params.searchType === SearchType.MC) {
                return (
                    <McDetails
                        key={details.id}
                        searchResult={details}
                        clickable={false}
                    />
                );
            }
        }
        if (fetchDetailsStatus === AsyncStatus.ERROR) {
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
        if (fetchFooterStatus === AsyncStatus.SUCCESS && scope && punchList) {
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
        if (fetchFooterStatus === AsyncStatus.ERROR) {
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
        <EntityPageWrapper>
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
        </EntityPageWrapper>
    );
};

export default withAccessControl(EntityPage, [
    'MCPKG/READ',
    'MCCR/READ',
    'PUNCHLISTITEM/READ',
]);
