import React, { useContext, useEffect, useState } from 'react';
import EdsIcon from '../../components/icons/EdsIcon';
import withAccessControl from '../../services/withAccessControl';
import useCommonHooks from '../../utils/useCommonHooks';
import { Route, Switch } from 'react-router-dom';
import ChecklistWrapper from './ChecklistWrapper';
import NewPunchWrapper from './NewPunchWrapper';
import { AsyncStatus } from '../../contexts/McAppContext';
import { PunchPreview } from '../../services/apiTypes';
import { Button } from '@equinor/eds-core-react';
import TagInfoWrapper from '../../components/TagInfoWrapper';
import {
    BackButton,
    FooterButton,
    Navbar,
    NavigationFooter,
    PunchList,
    removeSubdirectories,
    useSnackbar,
    ChecklistResponse,
} from '@equinor/procosys-webapp-components';
import ChecklistDetailsCard from './ChecklistDetailsCard';
import styled from 'styled-components';
import PlantContext from '../../contexts/PlantContext';
import { OfflineStatus } from '../../typings/enums';

const ContentWrapper = styled.div`
    padding-bottom: 66px;
`;

const ChecklistPage = (): JSX.Element => {
    const { history, url, path, api, params, offlineState } = useCommonHooks();
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
    const goBackToPunchListPage = removeSubdirectories(
        history.location.pathname
    );
    const goBackToEntityPage = removeSubdirectories(url, 2);
    const { snackbar, setSnackbarText } = useSnackbar();

    useEffect(() => {
        return (): void => {
            abortController.abort();
        };
    }, []);

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const detailsFromApi = await api.getChecklist(
                    params.plant,
                    params.checklistId,
                    abortSignal
                );
                setDetails(detailsFromApi);
                setFetchDetailsStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                if (!(error instanceof Error)) return;
                setSnackbarText(error.message);
                setFetchDetailsStatus(AsyncStatus.ERROR);
            }
        })();
    }, [api, params, refreshChecklistStatus]);

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const punchListFromApi = await api.getChecklistPunchList(
                    params.plant,
                    params.checklistId,
                    abortSignal
                );
                setPunchList(punchListFromApi);
                if (punchListFromApi.length === 0) {
                    setFetchPunchListStatus(AsyncStatus.EMPTY_RESPONSE);
                } else {
                    setFetchPunchListStatus(AsyncStatus.SUCCESS);
                }
            } catch (error) {
                if (!(error instanceof Error)) return;
                setSnackbarText(error.message);
                setFetchPunchListStatus(AsyncStatus.ERROR);
            }
        })();
    }, [api, params]);

    return (
        <main>
            <Navbar
                leftContent={
                    <BackButton
                        to={
                            isOnNewPunchPage
                                ? goBackToPunchListPage
                                : goBackToEntityPage
                        }
                    />
                }
                midContent={'MCCR'}
                rightContent={
                    history.location.pathname.includes(
                        '/new-punch'
                    ) ? undefined : (
                        <Button
                            variant="ghost"
                            onClick={(): void =>
                                history.push(`${url}/punch-list/new-punch`)
                            }
                            disabled={
                                !permissions.includes('PUNCHLISTITEM/CREATE')
                            }
                        >
                            New punch
                        </Button>
                    )
                }
                isOffline={offlineState == OfflineStatus.OFFLINE}
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
                                        )}/punch-item/${punch.id}`
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
                    goTo={(): void => history.push(`${url}`)}
                    icon={<EdsIcon name="playlist_added" />}
                    label={'Checklist'}
                />
                <FooterButton
                    active={isOnTagInfoPage}
                    goTo={(): void => history.push(`${url}/tag-info`)}
                    icon={<EdsIcon name="tag" />}
                    label={'Tag info'}
                />
                <FooterButton
                    active={isOnPunchListPage}
                    goTo={(): void => history.push(`${url}/punch-list`)}
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
