import React from 'react';
import { Route, Switch } from 'react-router-dom';
import EdsIcon from '../../components/icons/EdsIcon';
import FooterButton from '../../components/navigation/FooterButton';
import Navbar from '../../components/navigation/Navbar';
import NavigationFooter from '../../components/navigation/NavigationFooter';
import withAccessControl from '../../services/withAccessControl';
import { COLORS } from '../../style/GlobalStyles';
import removeSubdirectories from '../../utils/removeSubdirectories';
import useCommonHooks from '../../utils/useCommonHooks';
import NewPunch from '../Checklist/NewPunch/NewPunch';
import ClearPunch from './ClearPunch/ClearPunch';

const PunchPage = (): JSX.Element => {
    const { api, params, path, history, url } = useCommonHooks();

    return (
        <>
            <Navbar
                noBorder
                leftContent={{
                    name: 'back',
                    url: `${removeSubdirectories(url, 2)}/punch-list`,
                }}
            />
            {
                // TODO: add details (looks like a new one, check details card in clear punch & the old app) isn't one in the current app, is one in the design
            }
            <Switch>
                <Route
                    exact
                    path={`${path}/tag-info`}
                    render={(): JSX.Element => <h1>tag info</h1>}
                />
                {
                    // TODO: change route below to choose between either clear or verify punch
                }
                <Route exact path={`${path}`} component={ClearPunch} />
            </Switch>
            <NavigationFooter>
                <FooterButton
                    active={!history.location.pathname.includes('/tag-info')}
                    goTo={(): void => history.push(url)}
                    icon={
                        <EdsIcon
                            name="warning_filled"
                            color={COLORS.mossGreen}
                        />
                    }
                    label="Punch item"
                />
                <FooterButton
                    active={history.location.pathname.includes('/tag-info')}
                    goTo={(): void => history.push(`${url}/tag-info`)}
                    icon={<EdsIcon name="info_circle" />}
                    label={'Tag info'}
                />
            </NavigationFooter>
        </>
    );
};

// TODO: change the permissions to the correct one(s)
export default withAccessControl(PunchPage, [
    'MCCR/READ',
    'PUNCHLISTITEM/READ',
]);
