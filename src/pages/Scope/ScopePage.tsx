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

// TODO: rename everything Comm pkg related
// TODO: remove everything task related

const ScopePageWrapper = styled.main``;

const ScopePage = (): JSX.Element => {
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
                    api.getScope(params.plant, params.commPkg), // TODO: change based on scope type (can get scope type from params)
                    api.getTasks(source.token, params.plant, params.commPkg),
                    api.getPunchList(params.plant, params.commPkg), // TODO: change based on scope type
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

    const determinePageTitle = (): string => {
        // TODO: once search merged: test params.searchType
        return 'MC package';
    };

    // TODO: change footer to actually work & to not have constant values (see prev. version before changes to navigation footer)
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
                        icon={<EdsIcon name="list" color={COLORS.mossGreen} />}
                        label="Scope"
                        numberOfItems={43}
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
        <ScopePageWrapper>
            {
                // TODO: Should navbar label be Saved Searches or Search?
            }
            <Navbar
                noBorder
                leftContent={{ name: 'back', label: 'Search' }}
                midContent={determinePageTitle()}
            />
            {
                // TODO: replace with the SearchResult component (or with a searchresult component if there are several)
            }
            <DetailsCard commPkgId={params.commPkg} />
            {
                // TODO: do we need to use routing to choose component? can we just to conditional rendering?
                // TODO: decide on how URL is supposed to look like for the different vews
            }
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
        </ScopePageWrapper>
    );
};

// TODO: change access control stuff
export default withAccessControl(ScopePage, [
    'COMMPKG/READ',
    'CPCL/READ',
    'RUNNING_LOGS/READ',
    'DOCUMENT/READ',
    'PUNCHLISTITEM/READ',
]);
