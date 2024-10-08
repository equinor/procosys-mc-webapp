import React, { useContext, useEffect, useState } from 'react';
import { Route, Switch, useLocation, useParams } from 'react-router-dom';
import EdsIcon from '../../components/icons/EdsIcon';
import withAccessControl from '../../services/withAccessControl';
import { COLORS } from '../../style/GlobalStyles';
import useCommonHooks from '../../utils/useCommonHooks';
import ClearPunchWrapper from './ClearPunchWrapper';
import VerifyPunchWrapper from './VerifyPunchWrapper';
import {
    SkeletonLoadingPage,
    BackButton,
    InfoItem,
    Navbar,
    NavigationFooter,
    FooterButton,
    removeSubdirectories,
    useSnackbar,
    AsyncStatus,
    CompletionStatus,
} from '@equinor/procosys-webapp-components';
import { DotProgress } from '@equinor/eds-core-react';
import AsyncPage from '../../components/AsyncPage';
import TagInfoWrapper from '../../components/TagInfoWrapper';
import PlantContext from '../../contexts/PlantContext';
import { DetailsWrapper } from '../Entity/EntityPageDetailsCard';
import { OfflineStatus } from '../../typings/enums';
import { abort } from 'process';
import { PunchItem } from '../../services/apiTypesCompletionApi';

const PunchPage = (): JSX.Element => {
    const {
        api,
        params,
        path,
        history,
        url,
        offlineState,
        completionApi,
        useTestColorIfOnTest,
    } = useCommonHooks();
    const { snackbar, setSnackbarText } = useSnackbar();
    const [punch, setPunch] = useState<PunchItem>();
    const [fetchPunchStatus, setFetchPunchStatus] = useState<AsyncStatus>(
        AsyncStatus.LOADING
    );
    const { permissions } = useContext(PlantContext);
    const [rowVersion, setRowVersion] = useState<string>();
    const location = useLocation();
    const checkListGuid = new URLSearchParams(location.search).get(
        'checkListGuid'
    );
    const tagId = new URLSearchParams(location.search).get('tagId');
    useEffect(() => {
        fetchPunchItem();
    }, [api, params]);

    const fetchPunchItem = async (): Promise<void> => {
        try {
            const punchFromApi = await completionApi.getPunchItem(
                params.plant,
                params.proCoSysGuid
            );

            setPunch(punchFromApi);
            setRowVersion(punchFromApi.rowVersion);
            setFetchPunchStatus(AsyncStatus.SUCCESS);
        } catch (error) {
            if (!(error instanceof Error)) return;
            setSnackbarText(error.message);
            setFetchPunchStatus(AsyncStatus.ERROR);
        }
    };

    const determineComponentToRender = (): JSX.Element => {
        if (punch === undefined) return <SkeletonLoadingPage />;
        if (punch.clearedAtUtc != null) {
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
                    status={punch.category as CompletionStatus}
                    statusLetters={[
                        punch.clearedBy?.firstName ? 'C' : null,
                        punch.verifiedBy?.firstName ? 'V' : null,
                    ]}
                    headerText={punch.tagNo}
                    description={punch.tagDescription}
                    attachments={punch.attachmentCount}
                    chips={[punch.itemNo.toString(), punch.formularType]}
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
                        to={`${removeSubdirectories(
                            url,
                            2
                        )}/punch-list?checkListGuid=${checkListGuid}`}
                    />
                }
                midContent="Punch Item"
                isOffline={offlineState == OfflineStatus.OFFLINE}
                testColor={useTestColorIfOnTest}
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
                            <TagInfoWrapper
                                tagId={parseInt(`${tagId}`)}
                                setSnackbarText={setSnackbarText}
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`${path}`}
                        render={determineComponentToRender}
                    />
                </Switch>
            </AsyncPage>
            {snackbar}
            <NavigationFooter>
                <FooterButton
                    active={!history.location.pathname.includes('/tag-info')}
                    goTo={(): void => history.push(url + `?tagId=${tagId}`)}
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
                    goTo={(): void =>
                        history.push(`${url}/tag-info?tagId=${tagId}`)
                    }
                    icon={<EdsIcon name="tag" />}
                    label={'Tag info'}
                />
            </NavigationFooter>
        </main>
    );
};

export default withAccessControl(PunchPage, ['PUNCHLISTITEM/READ', 'TAG/READ']);
