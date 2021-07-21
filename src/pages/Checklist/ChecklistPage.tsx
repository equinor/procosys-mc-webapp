import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import EdsIcon from '../../components/icons/EdsIcon';
import FooterButton from '../../components/navigation/FooterButton';
import Navbar from '../../components/navigation/Navbar';
import NavigationFooter from '../../components/navigation/NavigationFooter';
import withAccessControl from '../../services/withAccessControl';
import useCommonHooks from '../../utils/useCommonHooks';
import { Route, Switch } from 'react-router-dom';
import ChecklistWrapper from './ChecklistWrapper';
import NewPunch from './NewPunch/NewPunch';
import { AsyncStatus } from '../../contexts/McAppContext';
import { ChecklistResponse, PunchPreview } from '../../services/apiTypes';
import NavigationFooterShell from '../../components/navigation/NavigationFooterShell';
import { DotProgress } from '@equinor/eds-core-react';
import { DetailsWrapper } from '../Entity/EntityPage';
import TagInfo from './TagInfo';
import { InfoItem } from '@equinor/procosys-webapp-components';
import ChecklistPunchList from './ChecklistPunchList';
import removeSubdirectories from '../../utils/removeSubdirectories';

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

    const determineDetailsToRender = (): JSX.Element => {
        if (
            fetchDetailsStatus === AsyncStatus.SUCCESS &&
            details != undefined
        ) {
            return (
                <InfoItem
                    isDetailsCard
                    isScope
                    status={details.checkList.status}
                    statusLetters={[
                        details.checkList.signedByUser ? 'S' : null,
                        details.checkList.verifiedByUser ? 'V' : null,
                    ]}
                    headerText={details.checkList.tagNo}
                    description={details.checkList.tagDescription}
                    chips={[
                        details.checkList.mcPkgNo,
                        details.checkList.formularType,
                    ]}
                    attachments={details.checkList.attachmentCount}
                />
            );
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
        if (
            (fetchPunchListStatus === AsyncStatus.SUCCESS ||
                fetchPunchListStatus === AsyncStatus.EMPTY_RESPONSE) &&
            punchList != undefined
        ) {
            return (
                <NavigationFooter>
                    <FooterButton
                        active={
                            !history.location.pathname.includes(
                                '/punch-list'
                            ) &&
                            !history.location.pathname.includes('/tag-info')
                        }
                        goTo={(): void => history.push(`${url}`)}
                        icon={<EdsIcon name="playlist_added" />}
                        label={'Checklist'}
                    />
                    <FooterButton
                        active={history.location.pathname.includes('/tag-info')}
                        goTo={(): void => history.push(`${url}/tag-info`)}
                        icon={<EdsIcon name="tag" />}
                        label={'Tag info'}
                    />
                    <FooterButton
                        active={history.location.pathname.includes(
                            '/punch-list'
                        )}
                        goTo={(): void => history.push(`${url}/punch-list`)}
                        icon={<EdsIcon name="warning_outlined" />}
                        label={'Punch list'}
                        numberOfItems={punchList.length}
                    />
                </NavigationFooter>
            );
        }
        if (fetchPunchListStatus === AsyncStatus.ERROR) {
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
        <>
            <Navbar
                leftContent={{
                    name: 'back',
                    label: 'Back',
                    url: history.location.pathname.includes('/new-punch')
                        ? `${removeSubdirectories(
                              history.location.pathname,
                              1
                          )}`
                        : `${removeSubdirectories(url, 2)}`,
                }}
                midContent={'MCCR'}
                rightContent={
                    history.location.pathname.includes('/new-punch')
                        ? undefined
                        : { name: 'newPunch', url: `${url}/punch-list` }
                }
            />
            {determineDetailsToRender()}
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
                        <TagInfo tagId={details?.checkList.tagId} />
                    )}
                />
                <Route
                    exact
                    path={`${path}/punch-list`}
                    render={(): JSX.Element => (
                        <ChecklistPunchList
                            punchList={punchList}
                            fetchPunchListStatus={fetchPunchListStatus}
                        />
                    )}
                />
                <Route
                    exact
                    path={`${path}/punch-list/new-punch`}
                    component={NewPunch}
                />
            </Switch>
            {determineFooterToRender()}
        </>
    );
};

export default withAccessControl(ChecklistPage, [
    'MCCR/READ',
    'PUNCHLISTITEM/READ',
]);
