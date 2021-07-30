import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import SavedSearchPage from './pages/SavedSearch/SavedSearchPage';
import PunchPage from './pages/Punch/PunchPage';
import ChecklistPage from './pages/Checklist/ChecklistPage';

const SavedSearchRouter = (): JSX.Element => {
    const { path } = useRouteMatch();
    return (
        <Switch>
            <Route
                path={
                    '/:plant/:project/saved-search/:savedSearchType/:savedSearchId/punch-item/:punchItemId'
                }
                component={PunchPage}
            />
            <Route
                path={
                    '/:plant/:project/saved-search/:savedSearchType/:savedSearchId/checklist/:checklistId/punch-item/:punchItemId'
                }
                component={PunchPage}
            />
            <Route
                path={
                    '/:plant/:project/saved-search/:savedSearchType/:savedSearchId/checklist/:checklistId'
                }
                component={ChecklistPage}
            />
            <Route path={path} component={SavedSearchPage} />
        </Switch>
    );
};

export default SavedSearchRouter;
