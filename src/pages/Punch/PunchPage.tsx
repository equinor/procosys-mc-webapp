import React from 'react';
import { Route, Switch } from 'react-router-dom';
import withAccessControl from '../../services/withAccessControl';
import useCommonHooks from '../../utils/useCommonHooks';
import ClearPunch from './ClearPunch/ClearPunch';

const PunchPage = (): JSX.Element => {
    const { api, params, path, history, url } = useCommonHooks();
    return (
        <>
            {
                // TODO: add navbar back goes to checklist punch list or scope checklist, + goes to new punch
                //(should new punch go somewhere else if user starts on punch page as opposed to the checklist page?)
            }
            {
                // TODO: add details (looks like a new one, check details card in clear punch & the old app)
            }
            <Switch>
                <Route
                    exact
                    path={`${path}/tag-info`}
                    render={(): JSX.Element => <h1>tag info</h1>}
                />
                <Route exact path={`${path}`} component={ClearPunch} />
            </Switch>
            {
                // TODO: add a footer
            }
        </>
    );
};

// TODO: change the permissions to the correct one(s)
export default withAccessControl(PunchPage, [
    'MCCR/READ',
    'PUNCHLISTITEM/READ',
]);
