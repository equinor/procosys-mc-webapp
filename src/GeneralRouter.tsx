import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { PlantContextProvider } from './contexts/PlantContext';
import SelectProject from './pages/SelectProject/SelectProject';
import SearchPage from './pages/Search/SearchPage';
import SelectPlant from './pages/SelectPlant/SelectPlant';
import EntityPage from './pages/Entity/EntityPage';
import ChecklistPage from './pages/Checklist/ChecklistPage';
import PunchPage from './pages/Punch/PunchPage';
import SavedSearchRouter from './SavedSearchRouter';
import BookmarksRouter from './BookmarksRouter';

const McRouter = (): JSX.Element => {
    return (
        <PlantContextProvider>
            <Switch>
                <Route exact path={'/'} component={SelectPlant} />
                <Route exact path={'/:plant'} component={SelectProject} />
                <Route
                    path={'/:plant/:project/bookmarks/:searchType/:entityId'}
                    component={BookmarksRouter}
                />
                <Route
                    path={
                        '/:plant/:project/saved-search/:savedSearchType/:savedSearchId'
                    }
                    component={SavedSearchRouter}
                />
                <Route
                    path={
                        '/:plant/:project/:searchType/:entityId/punch-item/:proCoSysGuid'
                    }
                    component={PunchPage}
                />
                <Route
                    path={
                        '/:plant/:project/:searchType/:entityId/checklist/:checklistId/punch-item/:proCoSysGuid'
                    }
                    component={PunchPage}
                />
                <Route
                    path={
                        '/:plant/:project/:searchType/:entityId/checklist/:checklistId'
                    }
                    component={ChecklistPage}
                />
                <Route
                    path={'/:plant/:project/:searchType/:entityId'}
                    component={EntityPage}
                />
                <Route path={'/:plant/:project'} component={SearchPage} />
            </Switch>
        </PlantContextProvider>
    );
};

export default McRouter;
