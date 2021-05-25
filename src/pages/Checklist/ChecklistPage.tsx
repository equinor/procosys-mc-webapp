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
import NewPunch from '../Punch/NewPunch/NewPunch';
import Scope from '../Entity/Scope/Scope';
import { AsyncStatus } from '../../contexts/McAppContext';
import { PunchPreview } from '../../services/apiTypes';
import NavigationFooterShell from '../../components/navigation/NavigationFooterShell';
import { DotProgress } from '@equinor/eds-core-react';
import { DetailsWrapper } from '../Entity/EntityPage';

const ChecklistPage = (): JSX.Element => {
    const { history, url, path, api, params } = useCommonHooks();
    const [punchList, setPunchList] = useState<PunchPreview[]>();
    const [details, setDetails] = useState<any>(); // TODO: figure out type the correct api call returns & add here
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
                const detailsFromApi = await api.getChecklist(
                    params.plant,
                    params.checklistId
                    //source.token
                );
                setDetails(detailsFromApi);
                setFetchDetailsStatus(AsyncStatus.SUCCESS);
            } catch {
                setFetchDetailsStatus(AsyncStatus.ERROR);
            }
        })();
    }, [api, params]);

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const punchListFromApi = await api.getChecklistPunchList(
                    params.plant,
                    params.checklistId,
                    source.token
                );
                setPunchList(punchListFromApi);
                setFetchFooterStatus(AsyncStatus.SUCCESS);
            } catch {
                setFetchFooterStatus(AsyncStatus.ERROR);
            }
        })();
    }, [api, params]);

    const determineDetailsToRender = (): JSX.Element => {
        if (
            fetchDetailsStatus === AsyncStatus.SUCCESS &&
            details != undefined
        ) {
            // TODO: return the correct info card (do I have to make a new one??)
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
            fetchFooterStatus === AsyncStatus.SUCCESS &&
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
                        icon={<EdsIcon name="list" />}
                        label={'Checklist'}
                    />
                    <FooterButton
                        active={history.location.pathname.includes('/tag-info')}
                        goTo={(): void => history.push(`${url}/tag-info`)}
                        icon={<EdsIcon name="info_circle" />}
                        label={'Tag info'}
                    />
                    <FooterButton
                        active={history.location.pathname.includes(
                            '/punch-list'
                        )}
                        goTo={(): void => history.push(`${url}/punch-list`)}
                        icon={<EdsIcon name="warning_filled" />}
                        label={'Punch list'}
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
        <>
            {
                // TODO: ask whether MCCR is the correct title for the page
            }
            <Navbar
                leftContent={{ name: 'back' }}
                midContent={'MCCR'}
                rightContent={{ name: 'newPunch' }}
            />
            {determineDetailsToRender()}
            {
                // TODO: ask whether all content needs the bottom spaces from checklist wrapper, is yes: add a wrapper to content
            }
            {
                // TODO: add correct components to routes
            }
            <Switch>
                <Route exact path={`${path}`} component={ChecklistWrapper} />
                <Route
                    exact
                    path={`${path}/tag-info`}
                    component={ChecklistWrapper}
                />
                <Route
                    exact
                    path={`${path}/punch-list`}
                    component={ChecklistWrapper}
                />
                <Route exact path={`${path}/new-punch`} component={NewPunch} />
            </Switch>
            {determineFooterToRender()}
        </>
    );
};

// TODO: add correct permisssions(?) (must also add to the test thing)
export default withAccessControl(ChecklistPage, []);
