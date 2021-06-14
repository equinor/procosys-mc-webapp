import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Axios from 'axios';
import EdsIcon from '../../components/icons/EdsIcon';
import FooterButton from '../../components/navigation/FooterButton';
import Navbar from '../../components/navigation/Navbar';
import NavigationFooter from '../../components/navigation/NavigationFooter';
import withAccessControl from '../../services/withAccessControl';
import { COLORS } from '../../style/GlobalStyles';
import removeSubdirectories from '../../utils/removeSubdirectories';
import useCommonHooks from '../../utils/useCommonHooks';
import ClearPunch from './ClearPunch/ClearPunch';
import { PunchItem } from '../../services/apiTypes';
import { AsyncStatus } from '../../contexts/McAppContext';
import VerifyPunch from './VerifyPunch/VerifyPunch';
import SkeletonLoadingPage from '../../components/loading/SkeletonLoader';
import ErrorPage from '../../components/error/ErrorPage';

const PunchPage = (): JSX.Element => {
    const { api, params, path, history, url } = useCommonHooks();
    const [punch, setPunch] = useState<PunchItem>();
    const [fetchPunchStatus, setFetchPunchStatus] = useState<AsyncStatus>(
        AsyncStatus.LOADING
    );

    useEffect(() => {
        const source = Axios.CancelToken.source();
        (async (): Promise<void> => {
            try {
                const punchFromApi = await api.getPunchItem(
                    params.plant,
                    params.punchItemId,
                    source.token
                );
                setPunch(punchFromApi);
                setFetchPunchStatus(AsyncStatus.SUCCESS);
            } catch {
                setFetchPunchStatus(AsyncStatus.ERROR);
            }
        })();
        return (): void => {
            source.cancel();
        };
    }, [api, params]);

    const determineComponentToRender = (): JSX.Element => {
        if (punch != undefined) {
            return punch.clearedAt ? <VerifyPunch /> : <ClearPunch />;
        }
        if (fetchPunchStatus === AsyncStatus.ERROR) {
            return (
                <ErrorPage
                    title="Unable to load punch item."
                    description="Please check your connection, reload this page or try again later."
                />
            );
        }
        return <SkeletonLoadingPage />;
    };

    return (
        <>
            <Navbar
                noBorder
                leftContent={{
                    name: 'back',
                    url: `${removeSubdirectories(url, 2)}/punch-list`,
                }}
            />
            <Switch>
                <Route
                    exact
                    path={`${path}/tag-info`}
                    render={(): JSX.Element => <h1>tag info</h1>}
                />
                <Route
                    exact
                    path={`${path}`}
                    render={determineComponentToRender}
                />
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
