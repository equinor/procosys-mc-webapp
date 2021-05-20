import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import ChecklistWrapper from './pages/Checklist/ChecklistWrapper';
import CommPkg from './pages/Entity/CommPkg';
import NewPunch from './pages/Punch/NewPunch/NewPunch';
import ClearPunch from './pages/Punch/ClearPunch/ClearPunch';
import VerifyPunch from './pages/Punch/VerifyPunch/VerifyPunch';
import Task from './pages/Task/Task';

const CommPkgRouter = (): JSX.Element => {
    const { path } = useRouteMatch();
    return (
        <Switch>
            <Route
                exact
                path={`${path}/scope/:checklistId`}
                component={ChecklistWrapper}
            />
            <Route
                exact
                path={`${path}/scope/:checklistId/new-punch`}
                component={NewPunch}
            />
            <Route exact path={`${path}/tasks/:taskId`} component={Task} />
            <Route
                exact
                path={`${path}/punch-list/:punchItemId/clear`}
                component={ClearPunch}
            />
            <Route
                exact
                path={`${path}/punch-list/:punchItemId/verify`}
                component={VerifyPunch}
            />
            <Route path={path} component={CommPkg} />
        </Switch>
    );
};

export default CommPkgRouter;
