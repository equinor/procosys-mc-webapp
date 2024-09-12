import React, { useCallback, useContext, useEffect, useState } from 'react';
import EdsIcon from '../../components/icons/EdsIcon';
import withAccessControl from '../../services/withAccessControl';
import useCommonHooks from '../../utils/useCommonHooks';
import { Route, Switch } from 'react-router-dom';
import ChecklistWrapper from './ChecklistWrapper';
import NewPunchWrapper from './NewPunchWrapper';
import { PunchPreview } from '../../services/apiTypes';
import { Button } from '@equinor/eds-core-react';
import TagInfoWrapper from '../../components/TagInfoWrapper';
import {
    AsyncStatus,
    BackButton,
    FooterButton,
    Navbar,
    NavigationFooter,
    PunchList,
    removeSubdirectories,
    useSnackbar,
    ChecklistResponse,
    isOfType,
    isArrayOfType,
} from '@equinor/procosys-webapp-components';
import ChecklistDetailsCard from './ChecklistDetailsCard';
import styled from 'styled-components';
import PlantContext from '../../contexts/PlantContext';
import { OfflineStatus } from '../../typings/enums';
import Axios from 'axios';

const ContentWrapper = styled.div`
    padding-bottom: 66px;
`;

export const NavButton = styled(Button)`
    color: inherit;
`;

const ChecklistPage = (): JSX.Element => {
    const {
        history,
        url,
        path,
        api,
        params,
        offlineState,
        useTestColorIfOnTest,
    } = useCommonHooks();
    const { permissions } = useContext(PlantContext);
    const [punchList, setPunchList] = useState<PunchPreview[]>();
    const [details, setDetails] = useState<ChecklistResponse>();
    const [fetchPunchListStatus, setFetchPunchListStatus] = useState(
        AsyncStatus.LOADING
    );
    const [fetchDetailsStatus, setFetchDetailsStatus] = useState(
        AsyncStatus.LOADING
    );
    const [refreshChecklistStatus, setRefreshChecklistStatus] = useState(false);
    const abortController = new AbortController();
    const abortSignal = abortController.signal;
    const isOnNewPunchPage = history.location.pathname.includes('/new-punch');
    const isOnPunchListPage = history.location.pathname.includes('/punch-list');
    const isOnTagInfoPage = history.location.pathname.includes('/tag-info');
    const { snackbar, setSnackbarText } = useSnackbar();
    const source = Axios.CancelToken.source();
    const searchParams = new URLSearchParams(window.location.search);
    const checkListGuid = searchParams.get('checkListGuid');

    const goBackToPunchListPage = removeSubdirectories(
        history.location.pathname
    );
    const goBackToEntityPage = removeSubdirectories(url, 2);

    const getCheckList = useCallback(async () => {
        try {
            setFetchDetailsStatus(AsyncStatus.LOADING);
            const detailsFromApi = await api.getChecklist(
                params.plant,
                params.checklistId,
                abortSignal
            );
            if (detailsFromApi && isOfType(detailsFromApi, 'checkList')) {
                setDetails(detailsFromApi);
                setFetchDetailsStatus(AsyncStatus.SUCCESS);
            } else {
                throw new Error('Invalid checklist data');
            }
        } catch (error) {
            console.error('Failed to fetch checklist:', error);
            setFetchDetailsStatus(AsyncStatus.ERROR);
        }
    }, [api, params.plant, params.checklistId, abortSignal]);

    const getPunchList = useCallback(async () => {
        try {
            setFetchPunchListStatus(AsyncStatus.LOADING);
            const punchListFromApi = await api.getChecklistPunchList(
                params.plant,
                params.checklistId,
                abortSignal
            );
            setPunchList(punchListFromApi);
            setFetchPunchListStatus(
                punchListFromApi.length === 0
                    ? AsyncStatus.EMPTY_RESPONSE
                    : AsyncStatus.SUCCESS
            );
        } catch (error) {
            console.error('Failed to fetch punch list:', error);
            setFetchPunchListStatus(AsyncStatus.ERROR);
        }
    }, [api, params.plant, params.checklistId, abortSignal]);

    useEffect(() => {
        getCheckList();
        getPunchList();
        return (): void => {
            abortController.abort();
        };
    }, [history.location.pathname]);

    return (
        <main>
            <Navbar
                leftContent={
                    <BackButton
                        to={
                            isOnNewPunchPage
                                ? goBackToPunchListPage +
                                  `?checkListGuid=${checkListGuid}`
                                : goBackToEntityPage +
                                  `?checkListGuid=${checkListGuid}`
                        }
                    />
                }
                midContent={'MCCR'}
                rightContent={
                    history.location.pathname.includes(
                        '/new-punch'
                    ) ? undefined : (
                        <NavButton
                            variant="ghost"
                            onClick={(): void =>
                                history.push(
                                    `${url}/punch-list/new-punch${location.search}`
                                )
                            }
                            disabled={
                                !permissions.includes('PUNCHLISTITEM/CREATE')
                            }
                        >
                            New punch
                        </NavButton>
                    )
                }
                isOffline={offlineState == OfflineStatus.OFFLINE}
                testColor={useTestColorIfOnTest}
            />
            <ChecklistDetailsCard
                fetchDetailsStatus={fetchDetailsStatus}
                details={details}
            />
            <ContentWrapper>
                <Switch>
                    <Route
                        exact
                        path={`${path}`}
                        render={(): JSX.Element => (
                            <ChecklistWrapper
                                refreshChecklistStatus={
                                    setRefreshChecklistStatus
                                }
                                setSnackbarText={setSnackbarText}
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`${path}/tag-info`}
                        render={(): JSX.Element => (
                            <TagInfoWrapper
                                tagId={details?.checkList.tagId}
                                setSnackbarText={setSnackbarText}
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
                                        )}/punch-item/${
                                            punch.proCoSysGuid
                                        }?checkListGuid=${checkListGuid}&tagId=${
                                            punchList?.at(0)?.tagId
                                        }`
                                    )
                                }
                                punchList={punchList}
                                isChecklistPunchList
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`${path}/punch-list/new-punch`}
                        component={NewPunchWrapper}
                    />
                </Switch>
                {snackbar}
            </ContentWrapper>
            <NavigationFooter footerStatus={fetchPunchListStatus}>
                <FooterButton
                    active={!(isOnPunchListPage || isOnTagInfoPage)}
                    goTo={(): void =>
                        history.push(`${url}?checkListGuid=${checkListGuid}`)
                    }
                    icon={<EdsIcon name="playlist_added" />}
                    label={'Checklist'}
                />
                <FooterButton
                    active={isOnTagInfoPage}
                    goTo={(): void =>
                        history.push(
                            `${url}/tag-info?checkListGuid=${checkListGuid}`
                        )
                    }
                    icon={<EdsIcon name="tag" />}
                    label={'Tag info'}
                />
                <FooterButton
                    active={isOnPunchListPage}
                    goTo={(): void =>
                        history.push(
                            `${url}/punch-list?checkListGuid=${checkListGuid}`
                        )
                    }
                    icon={<EdsIcon name="warning_outlined" />}
                    label={'Punch list'}
                    numberOfItems={punchList?.length}
                />
            </NavigationFooter>
        </main>
    );
};

export default withAccessControl(ChecklistPage, [
    'MCCR/READ',
    'PUNCHLISTITEM/READ',
]);
