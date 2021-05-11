import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { PlantContextProvider } from './contexts/PlantContext';
import SelectProject from './pages/SelectProject/SelectProject';
import Search from './pages/Search/Search';
import SelectPlant from './pages/SelectPlant/SelectPlant';
import ScopePage from './pages/Scope/ScopePage';
import Bookmarks from './pages/Bookmarks/Bookmarks';

// TODO: decide on routing for the different pages
// TODO: what happens if something else after itemId now??
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
                {
                    // TODO: use the blueprint route below to route to more specific routes than the scope page
                }
                <Route
                    path={'/:plant/:project/:searchType/:itemId/bookmark'}
                    component={Bookmarks}
                />
                <Route
                    path={'/:plant/:project/:searchType/:itemId'}
                    component={ScopePage}
                />
            </Switch>
        </PlantContextProvider>
    );
};

export default McRouter;
