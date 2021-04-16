import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { PlantContextProvider } from './contexts/PlantContext';
import SelectProject from './pages/SelectProject/SelectProject';
import Search from './pages/Search/Search';
import SelectPlant from './pages/SelectPlant/SelectPlant';
import CommPkgRouter from './CommPkgRouter';
import Bookmarks from './pages/Bookmarks/Bookmarks';

const CommRouter = (): JSX.Element => {
    return (
        <PlantContextProvider>
            <Switch>
                <Route exact path={'/'} component={SelectPlant} />
                <Route exact path={'/:plant'} component={SelectProject} />
                <Route exact path={'/:plant/:project'} component={Bookmarks} />
                <Route
                    exact
                    path={'/:plant/:project/search'}
                    component={Search}
                />
                <Route
                    path={'/:plant/:project/:commPkg'}
                    component={CommPkgRouter}
                />
            </Switch>
        </PlantContextProvider>
    );
};

export default CommRouter;
