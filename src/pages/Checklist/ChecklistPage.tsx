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

const ChecklistPage = (): JSX.Element => {
    const { history, url, path, api, params } = useCommonHooks();
    const [punchList, setPunchList] = useState<PunchPreview[]>();
    const [fetchFooterStatus, setFetchFooterStatus] = useState(
        AsyncStatus.LOADING
    );
    // TODO: add fetch status things
    const source = Axios.CancelToken.source();

    useEffect(() => {
        return (): void => {
            source.cancel();
        };
    }, []);

    useEffect(() => {
        //TODO: get info about the checklist
    });

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

    const determineFooterToRender = (): JSX.Element => {
        if (
            fetchFooterStatus === AsyncStatus.SUCCESS &&
            punchList != undefined
        ) {
            return (
                <NavigationFooter>
                    {
                        // TODO: fix active state
                    }
                    <FooterButton
                        active={true}
                        goTo={(): void => history.push(`${url}`)}
                        icon={<EdsIcon name="list" />}
                        label={'Checklist'}
                    />
                    <FooterButton
                        active={false}
                        goTo={(): void => history.push(`${url}/tag-info`)}
                        icon={<EdsIcon name="info_circle" />}
                        label={'Tag info'}
                    />
                    <FooterButton
                        active={false}
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
            {
                // TODO: add details card (which one??)
            }
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
