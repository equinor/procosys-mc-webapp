import React, { useEffect, useState } from 'react';
import DetailsCard from './DetailsCard';
import { Redirect, Route, Switch } from 'react-router-dom';
import Scope from './Scope/Scope';
import Tasks from './Tasks/Tasks';
import PunchList from './PunchList/PunchList';
import Navbar from '../../components/navigation/Navbar';
import styled from 'styled-components';
import useCommonHooks from '../../utils/useCommonHooks';
import { AsyncStatus } from '../../contexts/CommAppContext';
import {
    ChecklistPreview,
    TaskPreview,
    PunchPreview,
} from '../../services/apiTypes';
import { DotProgress } from '@equinor/eds-core-react';
import NavigationFooterShell from '../../components/navigation/NavigationFooterShell';
import withAccessControl from '../../services/withAccessControl';
import Axios from 'axios';
import calculateHighestStatus from '../../utils/calculateHighestStatus';
import NavigationFooter from '../../components/navigation/NavigationFooter';
import FooterButton from '../../components/navigation/FooterButton';
import EdsIcon from '../../components/icons/EdsIcon';
import { COLORS } from '../../style/GlobalStyles';

const CommPkgWrapper = styled.main``;

const CommPkg = (): JSX.Element => {
    const { api, params, path, history, url } = useCommonHooks();
    const [scope, setScope] = useState<ChecklistPreview[]>();
    const [tasks, setTasks] = useState<TaskPreview[]>();
    const [punchList, setPunchList] = useState<PunchPreview[]>();
    const [fetchFooterDataStatus, setFetchFooterDataStatus] = useState(
        AsyncStatus.LOADING
    );

    useEffect(() => {
        const source = Axios.CancelToken.source();
        (async (): Promise<void> => {
            try {
                const [
                    scopeFromApi,
                    tasksFromApi,
                    punchListFromApi,
                ] = await Promise.all([
                    api.getScope(params.plant, params.commPkg),
                    api.getTasks(source.token, params.plant, params.commPkg),
                    api.getPunchList(params.plant, params.commPkg),
                ]);
                setScope(scopeFromApi);
                setTasks(tasksFromApi);
                setPunchList(punchListFromApi);
                setFetchFooterDataStatus(AsyncStatus.SUCCESS);
            } catch {
                setFetchFooterDataStatus(AsyncStatus.ERROR);
            }
        })();
        return (): void => {
            source.cancel();
        };
    }, [api, params.plant, params.commPkg]);

    const determineFooterToRender = (): JSX.Element => {
        if (
            fetchFooterDataStatus === AsyncStatus.SUCCESS &&
            tasks &&
            scope &&
            punchList
        ) {
            return (
                <NavigationFooter>
                    <FooterButton
                        active={true}
                        goTo={(): void => history.push(url)}
                        icon={
                            <EdsIcon
                                name="check_circle_outlined"
                                color={COLORS.mossGreen}
                            />
                        }
                        label="Scope"
                        numberOfItems={234}
                    />
                    <FooterButton
                        active={false}
                        goTo={(): void => history.push(url)}
                        icon={
                            <EdsIcon
                                name="warning_filled"
                                color={COLORS.mossGreen}
                            />
                        }
                        label="Punch list"
                        numberOfItems={321}
                    />
                </NavigationFooter>
            );
        }
        if (fetchFooterDataStatus === AsyncStatus.ERROR) {
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
        <CommPkgWrapper>
            <Navbar
                noBorder
                leftContent={{ name: 'back', label: 'Bookmarks' }}
            />
            <DetailsCard commPkgId={params.commPkg} />
            <Switch>
                <Redirect exact path={path} to={`${path}/scope`} />
                <Route exact path={`${path}/scope`} component={Scope} />
                <Route exact path={`${path}/tasks`} component={Tasks} />
                <Route
                    exact
                    path={`${path}/punch-list`}
                    component={PunchList}
                />
            </Switch>
            {determineFooterToRender()}
        </CommPkgWrapper>
    );
};

export default withAccessControl(CommPkg, [
    'COMMPKG/READ',
    'CPCL/READ',
    'RUNNING_LOGS/READ',
    'DOCUMENT/READ',
    'PUNCHLISTITEM/READ',
]);
