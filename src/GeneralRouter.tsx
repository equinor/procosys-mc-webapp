import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { PlantContextProvider } from './contexts/PlantContext';
import SelectProject from './pages/SelectProject/SelectProject';
import Search from './pages/Search/Search';
import SelectPlant from './pages/SelectPlant/SelectPlant';
import PunchList from './pages/Scope/PunchList/PunchList';

const McRouter = (): JSX.Element => {
    return (
        <PlantContextProvider>
            <Switch>
                <Route exact path={'/'} component={SelectPlant} />
                <Route exact path={'/:plant'} component={SelectProject} />
                <Route exact path={'/:plant/:project'} component={Search} />
                <Redirect
                    exact
                    path={'/:plant/:project/:itemType'}
                    to={'/:plant/:project/'}
                />
                {
                    // TODO: remove temp. route below after pulling scope
                }
                <Route
                    exact
                    path={'/:plant/:project/:searchType/:itemId/punch-list'}
                    component={PunchList}
                />
            </Switch>
        </PlantContextProvider>
    );
};

export default McRouter;
