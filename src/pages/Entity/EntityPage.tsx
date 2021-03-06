import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import useCommonHooks from '../../utils/useCommonHooks';
import { AsyncStatus } from '../../contexts/McAppContext';
import {
    ChecklistPreview,
    PunchPreview,
    McPkgPreview,
    WoPreview,
    Tag,
    PoPreview,
} from '../../services/apiTypes';
import withAccessControl from '../../services/withAccessControl';
import Axios from 'axios';
import EdsIcon from '../../components/icons/EdsIcon';
import { COLORS } from '../../style/GlobalStyles';
import { SearchType } from '../Search/Search';
import WorkOrderInfo from './WorkOrderInfo';
import {
    BackButton,
    FooterButton,
    Navbar,
    NavigationFooter,
    PunchList,
    removeSubdirectories,
    Scope,
} from '@equinor/procosys-webapp-components';
import EntityPageDetailsCard from './EntityPageDetailsCard';

const EntityPageWrapper = styled.main``;

const ContentWrapper = styled.div`
    padding-bottom: 66px;
`;

const EntityPage = (): JSX.Element => {
    const { api, params, path, history, url } = useCommonHooks();
    const [scope, setScope] = useState<ChecklistPreview[]>();
    const [punchList, setPunchList] = useState<PunchPreview[]>();
    const [details, setDetails] = useState<
        McPkgPreview | WoPreview | Tag | PoPreview
    >();
    const [fetchScopeStatus, setFetchScopeStatus] = useState(
        AsyncStatus.LOADING
    );
    const [fetchPunchListStatus, setFetchPunchListStatus] = useState(
        AsyncStatus.LOADING
    );
    const [fetchFooterStatus, setFetchFooterStatus] = useState(
        AsyncStatus.LOADING
    );
    const [fetchDetailsStatus, setFetchDetailsStatus] = useState(
        AsyncStatus.LOADING
    );
    const source = Axios.CancelToken.source();
    const isOnPunchListPage = history.location.pathname.includes('/punch-list');
    const isOnWoInfoPage = history.location.pathname.includes('/wo-info');

    useEffect(() => {
        return (): void => {
            source.cancel();
        };
    }, []);

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const [punchListFromApi, scopeFromApi] = await Promise.all([
                    api.getPunchList(
                        params.plant,
                        params.searchType,
                        params.entityId,
                        source.token
                    ),
                    api.getScope(
                        params.plant,
                        params.searchType,
                        params.entityId,
                        source.token
                    ),
                ]);
                setPunchList(punchListFromApi);
                if (punchListFromApi.length > 0) {
                    setFetchPunchListStatus(AsyncStatus.SUCCESS);
                } else {
                    setFetchPunchListStatus(AsyncStatus.EMPTY_RESPONSE);
                }
                setScope(scopeFromApi);
                if (scopeFromApi.length > 0) {
                    setFetchScopeStatus(AsyncStatus.SUCCESS);
                } else {
                    setFetchScopeStatus(AsyncStatus.EMPTY_RESPONSE);
                }
                setFetchFooterStatus(AsyncStatus.SUCCESS);
            } catch {
                setFetchPunchListStatus(AsyncStatus.ERROR);
                setFetchScopeStatus(AsyncStatus.ERROR);
                setFetchFooterStatus(AsyncStatus.ERROR);
            }
        })();
    }, [api, params]);

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const detailsFromApi = await api.getEntityDetails(
                    params.plant,
                    params.searchType,
                    params.entityId,
                    source.token
                );
                setDetails(detailsFromApi);
                setFetchDetailsStatus(AsyncStatus.SUCCESS);
            } catch {
                setFetchDetailsStatus(AsyncStatus.ERROR);
            }
        })();
    }, [api, params]);

    return (
        <EntityPageWrapper>
            <Navbar
                leftContent={
                    <BackButton to={`${removeSubdirectories(url, 2)}`} />
                }
                noBorder
                midContent={
                    params.searchType === SearchType.MC
                        ? 'MC Package'
                        : params.searchType
                }
            />
            <EntityPageDetailsCard
                fetchDetailsStatus={fetchDetailsStatus}
                details={details}
            />
            <ContentWrapper>
                <Switch>
                    <Route
                        exact
                        path={`${path}`}
                        render={(): JSX.Element => (
                            <Scope
                                fetchScopeStatus={fetchScopeStatus}
                                onChecklistClick={(checklistId: number): void =>
                                    history.push(
                                        `${history.location.pathname}/checklist/${checklistId}`
                                    )
                                }
                                scope={scope}
                                isPoScope={history.location.pathname.includes(
                                    '/PO/'
                                )}
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`${path}/punch-list`}
                        render={(): JSX.Element => (
                            <PunchList
                                fetchPunchListStatus={fetchPunchListStatus}
                                onPunchClick={(punch: PunchPreview): void =>
                                    history.push(
                                        `${removeSubdirectories(
                                            history.location.pathname
                                        )}/punch-item/${punch.id}`
                                    )
                                }
                                punchList={punchList}
                                isPoPunchList={history.location.pathname.includes(
                                    '/PO/'
                                )}
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`${path}/WO-info`}
                        render={(): JSX.Element => (
                            <WorkOrderInfo
                                workOrder={details}
                                fetchWorkOrderStatus={fetchDetailsStatus}
                            />
                        )}
                    />
                </Switch>
            </ContentWrapper>
            <NavigationFooter footerStatus={fetchFooterStatus}>
                <FooterButton
                    active={!(isOnPunchListPage || isOnWoInfoPage)}
                    goTo={(): void => history.push(url)}
                    icon={<EdsIcon name="list" color={COLORS.mossGreen} />}
                    label="Scope"
                    numberOfItems={scope?.length}
                />
                {params.searchType === SearchType.WO ? (
                    <FooterButton
                        active={isOnWoInfoPage}
                        goTo={(): void => history.push(`${url}/WO-info`)}
                        icon={
                            <EdsIcon
                                name="info_circle"
                                color={COLORS.mossGreen}
                            />
                        }
                        label="WO info"
                    />
                ) : (
                    <></>
                )}
                <FooterButton
                    active={isOnPunchListPage}
                    goTo={(): void => history.push(`${url}/punch-list`)}
                    icon={
                        <EdsIcon
                            name="warning_outlined"
                            color={COLORS.mossGreen}
                        />
                    }
                    label="Punch list"
                    numberOfItems={punchList?.length}
                />
            </NavigationFooter>
        </EntityPageWrapper>
    );
};

export default withAccessControl(EntityPage, [
    'MCPKG/READ',
    'WO/READ',
    'TAG/READ',
    'MCCR/READ',
    'PUNCHLISTITEM/READ',
    'PURCHASEORDER/READ',
]);
