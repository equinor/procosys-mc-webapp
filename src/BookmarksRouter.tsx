import React from 'react';
import { Route, useRouteMatch } from 'react-router-dom';
import PunchPage from './pages/Punch/PunchPage';
import ChecklistPage from './pages/Checklist/ChecklistPage';
import EntityPage from './pages/Entity/EntityPage';
import { Routes } from 'react-router';

const BookmarksRouter = (): JSX.Element => {
    const { path } = useRouteMatch();
    return (
        <Routes>
            <Route
                path={
                    '/:plant/:project/bookmarks/:searchType/:entityId/punch-item/:punchItemId/*'
                }
            >
                <PunchPage />
            </Route>
            <Route
                path={
                    '/:plant/:project/bookmarks/:searchType/:entityId/checklist/:checklistId/punch-item/:punchItemId/*'
                }
            >
                <PunchPage />
            </Route>
            <Route
                path={
                    '/:plant/:project/bookmarks/:searchType/:entityId/checklist/:checklistId/*'
                }
            >
                <ChecklistPage />
            </Route>
            <Route path={path}>
                <EntityPage />
            </Route>
        </Routes>
    );
};

export default BookmarksRouter;
