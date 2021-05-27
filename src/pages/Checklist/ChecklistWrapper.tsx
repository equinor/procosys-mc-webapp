import React, { useState } from 'react';
import { Checklist } from '@equinor/procosys-webapp-components';
import useCommonHooks from '../../utils/useCommonHooks';
import styled from 'styled-components';
import useSnackbar from '../../utils/useSnackbar';

const BottomSpacer = styled.div`
    height: 70px;
`;

const ChecklistWrapper = (): JSX.Element => {
    const { auth, params, procosysApiSettings } = useCommonHooks();
    const { snackbar, setSnackbarText } = useSnackbar();
    const [checklistStatus, setChecklistStatus] = useState('OK');

    return (
        <>
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
        </>
    );
};

export default ChecklistWrapper;
