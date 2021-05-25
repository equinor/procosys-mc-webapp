import React, { useEffect } from 'react';
import Axios from 'axios';
import EdsIcon from '../../components/icons/EdsIcon';
import FooterButton from '../../components/navigation/FooterButton';
import Navbar from '../../components/navigation/Navbar';
import NavigationFooter from '../../components/navigation/NavigationFooter';
import withAccessControl from '../../services/withAccessControl';
import useCommonHooks from '../../utils/useCommonHooks';
import { Route, Switch } from 'react-router-dom';
import ChecklistWrapper from './ChecklistWrapper';
import NewPunch from '../Punch/NewPunch/NewPunch';
import Scope from '../Entity/Scope/Scope';

const ChecklistPage = (): JSX.Element => {
    const { history, url, path } = useCommonHooks();
    // TODO: add fetch status things
    const source = Axios.CancelToken.source();

    useEffect(() => {
        return (): void => {
            source.cancel();
        };
    }, []);

    useEffect(() => {
        //TODO: get info about the checklist
    });

    useEffect(() => {
        // TODO: get info about punch list
    });

    return (
        <>
            {
                // TODO: ask whether MCCR is the correct title for the page
            }
            <Navbar
                leftContent={{ name: 'back' }}
                midContent={'MCCR'}
                rightContent={{ name: 'newPunch' }}
            />
            {
                // TODO: add details card (which one??)
            }
            {
                // TODO: ask whether all content needs the bottom spaces from checklist wrapper, is yes: add a wrapper to content
            }
            {
                // TODO: add correct components to routes
            }
            <Switch>
                <Route exact path={`${path}`} component={ChecklistWrapper} />
                <Route
                    exact
                    path={`${path}/tag-info`}
                    component={ChecklistWrapper}
                />
                <Route
                    exact
                    path={`${path}/punch-list`}
                    component={ChecklistWrapper}
                />
                <Route exact path={`${path}/new-punch`} component={NewPunch} />
            </Switch>
            <NavigationFooter>
                {
                    // TODO: fix active state
                }
                {
                    // TODO: ask abour number of items in checklist footer button, what is it?
                }
                <FooterButton
                    active={true}
                    goTo={(): void => history.push(`${url}`)}
                    icon={<EdsIcon name="list" />}
                    label={'Checklist'}
                    numberOfItems={312}
                />
                <FooterButton
                    active={false}
                    goTo={(): void => history.push(`${url}/tag-info`)}
                    icon={<EdsIcon name="info_circle" />}
                    label={'Tag info'}
                />
                {
                    // TODO: change numberOfItems to length of punch list
                }
                <FooterButton
                    active={false}
                    goTo={(): void => history.push(`${url}/punch-list`)}
                    icon={<EdsIcon name="warning_filled" />}
                    label={'Punch list'}
                    numberOfItems={234}
                />
            </NavigationFooter>
        </>
    );
};

// TODO: add correct permisssions(?) (must also add to the test thing)
export default withAccessControl(ChecklistPage, []);
