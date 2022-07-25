import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { PlantContextProvider } from './contexts/PlantContext';
import SelectProject from './pages/SelectProject/SelectProject';
import Search from './pages/Search/Search';
import SelectPlant from './pages/SelectPlant/SelectPlant';
import EntityPage from './pages/Entity/EntityPage';
import ChecklistPage from './pages/Checklist/ChecklistPage';
import PunchPage from './pages/Punch/PunchPage';
import Bookmarks from './pages/OfflineBookmark/Bookmarks';
import SavedSearchRouter from './SavedSearchRouter';

const McRouter = (): JSX.Element => {
    return (
        <PlantContextProvider>
            <Switch>
                <Route exact path={'/'} component={SelectPlant} />
                <Route exact path={'/:plant'} component={SelectProject} />
                <Route exact path={'/:plant/:project'} component={Search} />
                <Route
                    exact
                    path={'/:plant/:project/bookmark'}
                    component={Bookmarks}
                />

                <Route
                    path={
                        '/:plant/:project/saved-search/:savedSearchType/:savedSearchId'
                    }
                    component={SavedSearchRouter}
                />
                <Route
                    path={
                        '/:plant/:project/:searchType/:entityId/punch-item/:punchItemId'
                    }
                    component={PunchPage}
                />
                <Route
                    path={
                        '/:plant/:project/:searchType/:entityId/checklist/:checklistId/punch-item/:punchItemId'
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
            </Switch>
        </PlantContextProvider>
    );
};

export default McRouter;
