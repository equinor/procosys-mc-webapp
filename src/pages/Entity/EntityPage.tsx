import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
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
    IpoDetails,
} from '../../services/apiTypes';
import withAccessControl from '../../services/withAccessControl';
import EdsIcon from '../../components/icons/EdsIcon';
import { COLORS } from '../../style/GlobalStyles';
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
import { OfflineStatus, SearchType } from '../../typings/enums';
import { Routes } from 'react-router';

const EntityPageWrapper = styled.main``;

const ContentWrapper = styled.div`
    padding-bottom: 66px;
`;

const EntityPage = (): JSX.Element => {
    const { api, ipoApi, params, path, navigate, url, offlineState, location } =
        useCommonHooks();
    const [scope, setScope] = useState<ChecklistPreview[]>();
    const [punchList, setPunchList] = useState<PunchPreview[]>();
    const [details, setDetails] = useState<
        McPkgPreview | WoPreview | Tag | PoPreview | IpoDetails
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
    const controller = new AbortController();
    const abortSignal = controller.signal;
    const isOnPunchListPage = location.pathname.includes('/punch-list');
    const isOnWoInfoPage = location.pathname.includes('/wo-info');

    useEffect(() => {
        return (): void => {
            controller.abort();
        };
    }, []);

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                if (
                    details &&
                    params.plant &&
                    params.searchType &&
                    params.entityId
                ) {
                    const [punchListFromApi, scopeFromApi] = await Promise.all([
                        api.getPunchList(
                            params.plant,
                            params.searchType,
                            params.entityId,
                            details,
                            abortSignal
                        ),
                        api.getScope(
                            params.plant,
                            params.searchType,
                            params.entityId,
                            details,
                            abortSignal
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
                }
            } catch {
                setFetchPunchListStatus(AsyncStatus.ERROR);
                setFetchScopeStatus(AsyncStatus.ERROR);
                setFetchFooterStatus(AsyncStatus.ERROR);
            }
        })();
    }, [api, params, details]);

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                if (!params.plant || !params.searchType || !params.entityId) {
                    setFetchDetailsStatus(AsyncStatus.ERROR);
                    return;
                }
                let detailsFromApi;
                if (params.searchType !== SearchType.IPO) {
                    detailsFromApi = await api.getEntityDetails(
                        params.plant,
                        params.searchType,
                        params.entityId,
                        abortSignal
                    );
                } else {
                    detailsFromApi = await ipoApi.getIpoDetails(
                        params.plant,
                        params.entityId
                    );
                }
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
                isOffline={offlineState == OfflineStatus.OFFLINE}
            />
            <EntityPageDetailsCard
                fetchDetailsStatus={fetchDetailsStatus}
                details={details}
            />
            <ContentWrapper>
                <Routes>
                    <Route path={`${path}`}>
                        <Scope
                            fetchScopeStatus={fetchScopeStatus}
                            onChecklistClick={(checklistId: number): void =>
                                navigate(
                                    `${location.pathname}/checklist/${checklistId}`
                                )
                            }
                            scope={scope}
                            isPoScope={location.pathname.includes('/PO/')}
                            isIpoScope={location.pathname.includes('/IPO/')}
                        />
                    </Route>
                    <Route path={`${path}/punch-list`}>
                        <PunchList
                            fetchPunchListStatus={fetchPunchListStatus}
                            onPunchClick={(punch: PunchPreview): void =>
                                navigate(
                                    `${removeSubdirectories(
                                        location.pathname
                                    )}/punch-item/${punch.id}`
                                )
                            }
                            punchList={punchList}
                            isPoPunchList={location.pathname.includes('/PO/')}
                            isIpoPunchList={location.pathname.includes('/IPO/')}
                        />
                    </Route>
                    <Route path={`${path}/WO-info`}>
                        <WorkOrderInfo
                            workOrder={details}
                            fetchWorkOrderStatus={fetchDetailsStatus}
                        />
                    </Route>
                </Routes>
            </ContentWrapper>
            <NavigationFooter footerStatus={fetchFooterStatus}>
                <FooterButton
                    active={!(isOnPunchListPage || isOnWoInfoPage)}
                    goTo={(): void => navigate(url)}
                    icon={<EdsIcon name="list" color={COLORS.mossGreen} />}
                    label="Scope"
                    numberOfItems={scope?.length}
                />
                {params.searchType === SearchType.WO ? (
                    <FooterButton
                        active={isOnWoInfoPage}
                        goTo={(): void => navigate(`${url}/WO-info`)}
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
                    goTo={(): void => navigate(`${url}/punch-list`)}
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
