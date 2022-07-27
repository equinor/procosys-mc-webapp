import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import EdsIcon from '../../components/icons/EdsIcon';
import withAccessControl from '../../services/withAccessControl';
import useCommonHooks from '../../utils/useCommonHooks';
import { Route, Switch } from 'react-router-dom';
import ChecklistWrapper from './ChecklistWrapper';
import NewPunchWrapper from './NewPunchWrapper';
import { AsyncStatus } from '../../contexts/McAppContext';
import { ChecklistResponse, PunchPreview } from '../../services/apiTypes';
import { Button } from '@equinor/eds-core-react';
import TagInfoWrapper from '../../components/TagInfoWrapper';
import {
    BackButton,
    FooterButton,
    Navbar,
    NavigationFooter,
    PunchList,
    removeSubdirectories,
} from '@equinor/procosys-webapp-components';
import ChecklistDetailsCard from './ChecklistDetailsCard';

const ChecklistPage = (): JSX.Element => {
    const { history, url, path, api, params } = useCommonHooks();
    const [punchList, setPunchList] = useState<PunchPreview[]>();
    const [details, setDetails] = useState<ChecklistResponse>();
    const [fetchPunchListStatus, setFetchPunchListStatus] = useState(
        AsyncStatus.LOADING
    );
    const [fetchDetailsStatus, setFetchDetailsStatus] = useState(
        AsyncStatus.LOADING
    );
    const [refreshChecklistStatus, setRefreshChecklistStatus] = useState(false);
    const source = Axios.CancelToken.source();
    const isOnNewPunchPage = history.location.pathname.includes('/new-punch');
    const isOnPunchListPage = history.location.pathname.includes('/punch-list');
    const isOnTagInfoPage = history.location.pathname.includes('/tag-info');
    const goBackToPunchListPage = removeSubdirectories(
        history.location.pathname
    );
    const goBackToEntityPage = removeSubdirectories(url, 2);

    useEffect(() => {
        return (): void => {
            source.cancel();
        };
    }, []);

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const detailsFromApi = await api.getChecklist(
                    params.plant,
                    params.checklistId,
                    source.token
                );
                setDetails(detailsFromApi);
                setFetchDetailsStatus(AsyncStatus.SUCCESS);
            } catch {
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
                    source.token
                );
                setPunchList(punchListFromApi);
                if (punchListFromApi.length === 0) {
                    setFetchPunchListStatus(AsyncStatus.EMPTY_RESPONSE);
                } else {
                    setFetchPunchListStatus(AsyncStatus.SUCCESS);
                }
            } catch {
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
                        >
                            New punch
                        </Button>
                    )
                }
            />
            <ChecklistDetailsCard
                fetchDetailsStatus={fetchDetailsStatus}
                details={details}
            />
            <Switch>
                <Route
                    exact
                    path={`${path}`}
                    render={(): JSX.Element => (
                        <ChecklistWrapper
                            refreshChecklistStatus={setRefreshChecklistStatus}
                        />
                    )}
                />
                <Route
                    exact
                    path={`${path}/tag-info`}
                    render={(): JSX.Element => (
                        <TagInfoWrapper tagId={details?.checkList.tagId} />
                    )}
                />
                {/* <Route
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
                /> */}
                <Route
                    exact
                    path={`${path}/punch-list/new-punch`}
                    component={NewPunchWrapper}
                />
            </Switch>
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
