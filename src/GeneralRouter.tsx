import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { PlantContextProvider } from './contexts/PlantContext';
import SelectProject from './pages/SelectProject/SelectProject';
import Search from './pages/Search/Search';
import SelectPlant from './pages/SelectPlant/SelectPlant';
import EntityPage from './pages/Entity/EntityPage';
import ChecklistPage from './pages/Checklist/ChecklistPage';

const McRouter = (): JSX.Element => {
    return (
        <PlantContextProvider>
            <Switch>
                <Route exact path={'/'} component={SelectPlant} />
                <Route exact path={'/:plant'} component={SelectProject} />
                <Route exact path={'/:plant/:project'} component={Search} />
                <Redirect
                    exact
                    path={'/:plant/:project/:searchType'}
                    to={'/:plant/:project'}
                />
                <Route
                    path={
                        '/:plant/:project/:searchType/:itemId/checklist/:checklistId'
                    }
                    component={ChecklistPage}
                />
                <Redirect
                    exact
                    path={'/:plant/:project/:searchType/:itemId/checklist'}
                    to={'/:plant/:project/:searchType/:itemId'}
                />
                <Route
                    path={'/:plant/:project/:searchType/:itemId'}
                    component={EntityPage}
                />
            </Switch>
        </PlantContextProvider>
    );
};

export default McRouter;
