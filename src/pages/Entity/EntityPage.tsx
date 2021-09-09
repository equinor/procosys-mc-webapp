import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Scope from './Scope/Scope';
import PunchList from './PunchList/PunchList';
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
import { URLError } from '../../utils/matchPlantInURL';
import { isOfType } from '../../services/apiTypeGuards';
import WorkOrderInfo from './WorkOrderInfo';
import removeSubdirectories from '../../utils/removeSubdirectories';
import {
    BackButton,
    EntityDetails,
    Navbar,
    TextIcon,
} from '@equinor/procosys-webapp-components';

const EntityPageWrapper = styled.main``;

export const DetailsWrapper = styled.p`
    text-align: center;
    padding: 12px;
`;

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
                const punchListFromApi = await api.getPunchList(
                    params.plant,
                    params.searchType,
                    params.entityId,
                    source.token
                );
                setPunchList(punchListFromApi);
                if (punchListFromApi.length > 0) {
                    setFetchPunchListStatus(AsyncStatus.SUCCESS);
                } else {
                    setFetchPunchListStatus(AsyncStatus.EMPTY_RESPONSE);
                }
            } catch {
                setFetchPunchListStatus(AsyncStatus.ERROR);
            }
        })();
    }, [api, params]);

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const scopeFromApi = await api.getScope(
                    params.plant,
                    params.searchType,
                    params.entityId,
                    source.token
                );
                setScope(scopeFromApi);
                if (scopeFromApi.length > 0) {
                    setFetchScopeStatus(AsyncStatus.SUCCESS);
                } else {
                    setFetchScopeStatus(AsyncStatus.EMPTY_RESPONSE);
                }
            } catch {
                setFetchScopeStatus(AsyncStatus.ERROR);
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

    if (!Object.values(SearchType).includes(params.searchType)) {
        throw new URLError(
            `The "${params.searchType}" item type is not supported. Please double check your URL and make sure the type of the item you're trying to reach is either MC, PO, WO or Tag.`
        );
    }

    const determineDetailsToRender = (): JSX.Element => {
        if (
            fetchDetailsStatus === AsyncStatus.SUCCESS &&
            details != undefined
        ) {
            if (
                params.searchType === SearchType.MC &&
                isOfType<McPkgPreview>(details, 'mcPkgNo')
            ) {
                return (
                    <McDetails
                        key={details.id}
                        mcPkgDetails={details}
                        clickable={false}
                    />
                );
            } else if (
                params.searchType === SearchType.WO &&
                isOfType<WoPreview>(details, 'workOrderNo')
            ) {
                return (
                    <EntityDetails
                        isDetailsCard
                        icon={
                            <TextIcon color={COLORS.workOrderIcon} text="WO" />
                        }
                        headerText={details.workOrderNo}
                        description={details.title}
                        details={
                            details.disciplineCode
                                ? [
                                      `${details.disciplineCode}, ${details.disciplineDescription}`,
                                  ]
                                : undefined
                        }
                    />
                );
            } else if (
                params.searchType === SearchType.Tag &&
                isOfType<Tag>(details, 'tag')
            ) {
                return (
                    <EntityDetails
                        isDetailsCard
                        icon={<TextIcon color={COLORS.tagIcon} text="Tag" />}
                        headerText={details.tag.tagNo}
                        description={details.tag.description}
                    />
                );
            } else if (
                params.searchType === SearchType.PO &&
                isOfType<PoPreview>(details, 'callOffId')
            ) {
                return (
                    <EntityDetails
                        isDetailsCard
                        icon={
                            <TextIcon
                                color={COLORS.purchaseOrderIcon}
                                text="PO"
                            />
                        }
                        headerText={details.title}
                        description={details.description}
                        details={[details.responsibleCode]}
                    />
                );
            } else return <></>;
        } else if (fetchDetailsStatus === AsyncStatus.ERROR) {
            return (
                <DetailsWrapper>
                    Unable to load details. Please reload
                </DetailsWrapper>
            );
        } else {
            return (
                <DetailsWrapper>
                    <DotProgress color="primary" />
                </DetailsWrapper>
            );
        }
    };

    const determineFooterToRender = (): JSX.Element => {
        if (
            fetchScopeStatus === AsyncStatus.ERROR ||
            fetchPunchListStatus === AsyncStatus.ERROR
        ) {
            return (
                <NavigationFooterShell>
                    <p>Unable to load footer. Please reload</p>
                </NavigationFooterShell>
            );
        } else if (
            fetchScopeStatus === AsyncStatus.LOADING ||
            fetchPunchListStatus === AsyncStatus.LOADING
        ) {
            return (
                <NavigationFooterShell>
                    <DotProgress color="primary" />
                </NavigationFooterShell>
            );
        } else {
            return (
                <NavigationFooter>
                    <FooterButton
                        active={
                            !history.location.pathname.includes(
                                '/punch-list'
                            ) && !history.location.pathname.includes('/WO-info')
                        }
                        goTo={(): void => history.push(url)}
                        icon={<EdsIcon name="list" color={COLORS.mossGreen} />}
                        label="Scope"
                        numberOfItems={scope?.length}
                    />
                    {params.searchType === SearchType.WO ? (
                        <FooterButton
                            active={history.location.pathname.includes(
                                '/WO-info'
                            )}
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
                        active={history.location.pathname.includes(
                            '/punch-list'
                        )}
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
            );
        }
    };

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
            {determineDetailsToRender()}
            <ContentWrapper>
                <Switch>
                    <Route
                        exact
                        path={`${path}`}
                        render={(): JSX.Element => (
                            <Scope
                                scope={scope}
                                fetchScopeStatus={fetchScopeStatus}
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`${path}/punch-list`}
                        render={(): JSX.Element => (
                            <PunchList
                                punchList={punchList}
                                fetchPunchListStatus={fetchPunchListStatus}
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
            {determineFooterToRender()}
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
