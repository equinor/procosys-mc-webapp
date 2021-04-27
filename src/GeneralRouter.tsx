import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { PlantContextProvider } from './contexts/PlantContext';
import SelectProject from './pages/SelectProject/SelectProject';
import Search from './pages/Search/Search';
import SelectPlant from './pages/SelectPlant/SelectPlant';
import CommPkgRouter from './CommPkgRouter';

const McRouter = (): JSX.Element => {
    return (
        <PlantContextProvider>
            <Switch>
                <Route exact path={'/'} component={SelectPlant} />
                <Route exact path={'/:plant'} component={SelectProject} />
                <Redirect
                    exact
                    path={'/:plant/:project'}
                    to={`/:plant/:project/search`}
                />
                <Route path={'/:plant/:project/search'} component={Search} />
                <Route
                    path={'/:plant/:project/:commPkg'}
                    component={CommPkgRouter}
                />
            </Switch>
        </PlantContextProvider>
    );
};

export default McRouter;
