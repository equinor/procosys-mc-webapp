import React from 'react';
import { Route } from 'react-router-dom';
import { PlantContextProvider } from './contexts/PlantContext';
import SelectProject from './pages/SelectProject/SelectProject';
import SearchPage from './pages/Search/SearchPage';
import SelectPlant from './pages/SelectPlant/SelectPlant';
import EntityPage from './pages/Entity/EntityPage';
import ChecklistPage from './pages/Checklist/ChecklistPage';
import PunchPage from './pages/Punch/PunchPage';
import SavedSearchRouter from './SavedSearchRouter';
import BookmarksRouter from './BookmarksRouter';
import { Routes } from 'react-router';

const McRouter = (): JSX.Element => {
    return (
        <PlantContextProvider>
            <Routes>
                <Route path={'/'}>
                    <SelectPlant />
                </Route>
                <Route path={'/:plant'}>
                    <SelectProject />
                </Route>
                <Route
                    path={'/:plant/:project/bookmarks/:searchType/:entityId/*'}
                >
                    <BookmarksRouter />
                </Route>
                <Route
                    path={
                        '/:plant/:project/saved-search/:savedSearchType/:savedSearchId/*'
                    }
                >
                    <SavedSearchRouter />
                </Route>
                <Route
                    path={
                        '/:plant/:project/:searchType/:entityId/punch-item/:punchItemId/*'
                    }
                >
                    <PunchPage />
                </Route>
                <Route
                    path={
                        '/:plant/:project/:searchType/:entityId/checklist/:checklistId/punch-item/:punchItemId/*'
                    }
                >
                    <PunchPage />
                </Route>
                <Route
                    path={
                        '/:plant/:project/:searchType/:entityId/checklist/:checklistId/*'
                    }
                >
                    <ChecklistPage />
                </Route>
                <Route path={'/:plant/:project/:searchType/:entityId/*'}>
                    <EntityPage />
                </Route>
                <Route path={'/:plant/:project/*'}>
                    <SearchPage />
                </Route>
            </Routes>
        </PlantContextProvider>
    );
};

export default McRouter;
