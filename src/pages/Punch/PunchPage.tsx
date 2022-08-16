import React, { useContext, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Axios from 'axios';
import EdsIcon from '../../components/icons/EdsIcon';
import withAccessControl from '../../services/withAccessControl';
import { COLORS } from '../../style/GlobalStyles';
import useCommonHooks from '../../utils/useCommonHooks';
import ClearPunchWrapper from './ClearPunchWrapper';
import { PunchItem } from '../../services/apiTypes';
import { AsyncStatus } from '../../contexts/McAppContext';
import VerifyPunchWrapper from './VerifyPunchWrapper';
import {
    SkeletonLoadingPage,
    BackButton,
    InfoItem,
    Navbar,
    NavigationFooter,
    FooterButton,
    removeSubdirectories,
} from '@equinor/procosys-webapp-components';
import { DotProgress } from '@equinor/eds-core-react';
import AsyncPage from '../../components/AsyncPage';
import TagInfoWrapper from '../../components/TagInfoWrapper';
import PlantContext from '../../contexts/PlantContext';
import { DetailsWrapper } from '../Entity/EntityPageDetailsCard';

const PunchPage = (): JSX.Element => {
    const { api, params, path, history, url } = useCommonHooks();
    const [punch, setPunch] = useState<PunchItem>();
    const [fetchPunchStatus, setFetchPunchStatus] = useState<AsyncStatus>(
        AsyncStatus.LOADING
    );
    const { permissions } = useContext(PlantContext);

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
        if (punch === undefined) return <SkeletonLoadingPage />;
        if (punch.clearedAt != null) {
            return (
                <VerifyPunchWrapper
                    punchItem={punch}
                    canUnclear={permissions.includes('PUNCHLISTITEM/CLEAR')}
                    canVerify={permissions.includes('PUNCHLISTITEM/VERIFY')}
                />
            );
        } else {
            return (
                <ClearPunchWrapper
                    punchItem={punch}
                    setPunchItem={
                        setPunch as React.Dispatch<
                            React.SetStateAction<PunchItem>
                        >
                    }
                    canEdit={permissions.includes('PUNCHLISTITEM/WRITE')}
                    canClear={permissions.includes('PUNCHLISTITEM/CLEAR')}
                />
            );
        }
    };

    const determineDetailsCard = (): JSX.Element => {
        if (punch && fetchPunchStatus === AsyncStatus.SUCCESS) {
            return (
                <InfoItem
                    isDetailsCard
                    status={punch.status}
                    statusLetters={[
                        punch.clearedByFirstName ? 'C' : null,
                        punch.verifiedByFirstName ? 'V' : null,
                    ]}
                    headerText={punch.tagNo}
                    description={punch.tagDescription}
                    attachments={punch.attachmentCount}
                    chips={[punch.id.toString(), punch.formularType]}
                />
            );
        } else if (fetchPunchStatus === AsyncStatus.LOADING) {
            return (
                <DetailsWrapper>
                    <DotProgress color="primary" />
                </DetailsWrapper>
            );
        } else {
            return (
                <DetailsWrapper>
                    Unable to load details. Please reload
                </DetailsWrapper>
            );
        }
    };

    return (
        <main>
            <Navbar
                noBorder
                leftContent={
                    <BackButton
                        to={`${removeSubdirectories(url, 2)}/punch-list`}
                    />
                }
                midContent="Punch Item"
            />
            {determineDetailsCard()}
            <AsyncPage
                fetchStatus={fetchPunchStatus}
                errorMessage={'Unable to load punch item.'}
            >
                <Switch>
                    <Route
                        exact
                        path={`${path}/tag-info`}
                        render={(): JSX.Element => (
                            <TagInfoWrapper tagId={punch?.tagId} />
                        )}
                    />
                    <Route
                        exact
                        path={`${path}`}
                        render={determineComponentToRender}
                    />
                </Switch>
            </AsyncPage>
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
                    icon={<EdsIcon name="tag" />}
                    label={'Tag info'}
                />
            </NavigationFooter>
        </main>
    );
};

export default withAccessControl(PunchPage, ['PUNCHLISTITEM/READ', 'TAG/READ']);
