import React from 'react';
import { Route } from 'react-router-dom';
import SavedSearchPage from './pages/SavedSearch/SavedSearchPage';
import PunchPage from './pages/Punch/PunchPage';
import ChecklistPage from './pages/Checklist/ChecklistPage';
import { Routes, useLocation } from 'react-router';

const SavedSearchRouter = (): JSX.Element => {
    const location = useLocation();
    const path = location.pathname;
    return (
        <Routes>
            <Route
                path={
                    '/:plant/:project/saved-search/:savedSearchType/:savedSearchId/punch-item/:punchItemId/*'
                }
            >
                <PunchPage />
            </Route>
            <Route
                path={
                    '/:plant/:project/saved-search/:savedSearchType/:savedSearchId/checklist/:checklistId/punch-item/:punchItemId/*'
                }
            >
                <PunchPage />
            </Route>

            <Route
                path={
                    '/:plant/:project/saved-search/:savedSearchType/:savedSearchId/checklist/:checklistId/*'
                }
            >
                <ChecklistPage />
            </Route>
            <Route path={path}>
                <SavedSearchPage />
            </Route>
        </Routes>
    );
};

export default SavedSearchRouter;
