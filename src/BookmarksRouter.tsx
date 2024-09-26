import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import PunchPage from './pages/Punch/PunchPage';
import ChecklistPage from './pages/Checklist/ChecklistPage';
import EntityPage from './pages/Entity/EntityPage';

const BookmarksRouter = (): JSX.Element => {
    const { path } = useRouteMatch();
    return (
        <Switch>
            <Route
                path={
                    '/:plant/:project/bookmarks/:searchType/:entityId/punch-item/:proCoSysGuid'
                }
                component={PunchPage}
            />
            <Route
                path={
                    '/:plant/:project/bookmarks/:searchType/:entityId/checklist/:checklistId/punch-item/:proCoSysGuid'
                }
                component={PunchPage}
            />
            <Route
                path={
                    '/:plant/:project/bookmarks/:searchType/:entityId/checklist/:checklistId'
                }
                component={ChecklistPage}
            />
            <Route path={path} component={EntityPage} />
        </Switch>
    );
};

export default BookmarksRouter;
