import React, { useContext, useEffect, useState } from 'react';
import EdsIcon from '../../components/icons/EdsIcon';
import withAccessControl from '../../services/withAccessControl';
import useCommonHooks from '../../utils/useCommonHooks';
import { Route } from 'react-router-dom';
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
import styled from 'styled-components';
import PlantContext from '../../contexts/PlantContext';
import { OfflineStatus } from '../../typings/enums';
import { Routes } from 'react-router';

const ContentWrapper = styled.div`
    padding-bottom: 66px;
`;

const ChecklistPage = (): JSX.Element => {
    const { navigate, url, path, api, params, offlineState, location } =
        useCommonHooks();
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
    const isOnNewPunchPage = location.pathname.includes('/new-punch');
    const isOnPunchListPage = location.pathname.includes('/punch-list');
    const isOnTagInfoPage = location.pathname.includes('/tag-info');
    const goBackToPunchListPage = removeSubdirectories(location.pathname);
    const goBackToEntityPage = removeSubdirectories(url, 2);

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                if (!params.plant || !params.checklistId) {
                    setFetchDetailsStatus(AsyncStatus.ERROR);
                    return;
                }
                const detailsFromApi = await api.getChecklist(
                    params.plant,
                    params.checklistId,
                    abortSignal
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
                if (!params.plant || !params.checklistId) {
                    setFetchPunchListStatus(AsyncStatus.ERROR);
                    return;
                }
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
                    location.pathname.includes('/new-punch') ? undefined : (
                        <Button
                            variant="ghost"
                            onClick={(): void =>
                                navigate(`${url}/punch-list/new-punch`)
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
                <Routes>
                    <Route path={`${path}`}>
                        <ChecklistWrapper
                            refreshChecklistStatus={setRefreshChecklistStatus}
                        />
                    </Route>
                    <Route path={`${path}/tag-info`}>
                        <TagInfoWrapper tagId={details?.checkList.tagId} />
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
                            isChecklistPunchList
                        />
                    </Route>
                    <Route path={`${path}/punch-list/new-punch`}>
                        <NewPunchWrapper />
                    </Route>
                </Routes>
            </ContentWrapper>
            <NavigationFooter footerStatus={fetchPunchListStatus}>
                <FooterButton
                    active={!(isOnPunchListPage || isOnTagInfoPage)}
                    goTo={(): void => navigate(`${url}`)}
                    icon={<EdsIcon name="playlist_added" />}
                    label={'Checklist'}
                />
                <FooterButton
                    active={isOnTagInfoPage}
                    goTo={(): void => navigate(`${url}/tag-info`)}
                    icon={<EdsIcon name="tag" />}
                    label={'Tag info'}
                />
                <FooterButton
                    active={isOnPunchListPage}
                    goTo={(): void => navigate(`${url}/punch-list`)}
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
