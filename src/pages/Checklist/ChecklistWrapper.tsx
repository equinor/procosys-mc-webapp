import React, { useState } from 'react';
import Navbar from '../../components/navigation/Navbar';
import { Checklist } from '@equinor/procosys-webapp-components';
import useCommonHooks from '../../utils/useCommonHooks';
import NavigationFooter from '../../components/navigation/NavigationFooter';
import FooterButton from '../../components/navigation/FooterButton';
import EdsIcon from '../../components/icons/EdsIcon';
import styled from 'styled-components';
import useSnackbar from '../../utils/useSnackbar';

const BottomSpacer = styled.div`
    height: 70px;
`;

const ChecklistWrapper = (): JSX.Element => {
    const { auth, history, params, url, procosysApiSettings } =
        useCommonHooks();
    const { snackbar, setSnackbarText } = useSnackbar();
    const [checklistStatus, setChecklistStatus] = useState('OK');

    return (
        <>
            <Navbar
                leftContent={{ name: 'back' }}
                midContent={'MCCR'}
                rightContent={{ name: 'newPunch' }}
            />
            <Checklist
                checklistId={params.checklistId}
                plantId={params.plant}
                apiSettings={procosysApiSettings}
                getAccessToken={auth.getAccessToken}
                setSnackbarText={setSnackbarText}
                setChecklistStatus={setChecklistStatus}
            />
            {snackbar}
            <BottomSpacer />
            <NavigationFooter>
                <FooterButton
                    active={true}
                    goTo={(): void => history.push(`${url}/scope`)}
                    icon={<EdsIcon name="list" />}
                    label={'Checklist'}
                    numberOfItems={312}
                />
                <FooterButton
                    active={false}
                    goTo={(): void => history.push(`${url}/scope`)}
                    icon={<EdsIcon name="info_circle" />}
                    label={'Tag info'}
                />
                <FooterButton
                    active={false}
                    goTo={(): void => history.push(`${url}/scope`)}
                    icon={<EdsIcon name="warning_filled" />}
                    label={'Punch list'}
                    numberOfItems={234}
                />
            </NavigationFooter>
        </>
    );
};

export default ChecklistWrapper;
