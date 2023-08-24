import React from 'react';
import { Checklist, OfflineStatus } from '@equinor/procosys-webapp-components';
import useCommonHooks from '../../utils/useCommonHooks';
import styled from 'styled-components';

export const BottomSpacer = styled.div`
    height: 70px;
`;

type ChecklistWrapperProps = {
    refreshChecklistStatus: React.Dispatch<React.SetStateAction<boolean>>;
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
};

const ChecklistWrapper = ({
    refreshChecklistStatus,
    setSnackbarText,
}: ChecklistWrapperProps): JSX.Element => {
    const { auth, params, procosysApiSettings, offlineState } =
        useCommonHooks();

    return (
        <>
            <Checklist
                checklistId={params.checklistId}
                plantId={params.plant}
                apiSettings={procosysApiSettings}
                getAccessToken={auth.getAccessToken}
                setSnackbarText={setSnackbarText}
                refreshChecklistStatus={refreshChecklistStatus}
                offlineState={offlineState == OfflineStatus.OFFLINE}
            />
            <BottomSpacer />
        </>
    );
};

export default ChecklistWrapper;
