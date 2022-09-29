import React from 'react';
import { Checklist, useSnackbar } from '@equinor/procosys-webapp-components';
import useCommonHooks from '../../utils/useCommonHooks';
import styled from 'styled-components';

export const BottomSpacer = styled.div`
    height: 70px;
`;

type ChecklistWrapperProps = {
    refreshChecklistStatus: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChecklistWrapper = ({
    refreshChecklistStatus,
}: ChecklistWrapperProps): JSX.Element => {
    const { auth, params, procosysApiSettings, offlineState } =
        useCommonHooks();
    const { snackbar, setSnackbarText } = useSnackbar();

    return (
        <>
            <Checklist
                checklistId={params.checklistId}
                plantId={params.plant}
                apiSettings={procosysApiSettings}
                getAccessToken={auth.getAccessToken}
                setSnackbarText={setSnackbarText}
                refreshChecklistStatus={refreshChecklistStatus}
                offlineState={offlineState}
            />
            {snackbar}
            <BottomSpacer />
        </>
    );
};

export default ChecklistWrapper;
