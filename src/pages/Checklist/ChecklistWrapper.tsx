import React, { useContext } from 'react';
import {
    Attachment,
    ChecklistResponse,
    ChecklistV2,
    ChecklistV2Api,
    ItemToMultiSignOrVerify,
} from '@equinor/procosys-webapp-components';
import useCommonHooks from '../../utils/useCommonHooks';
import styled from 'styled-components';
import { OfflineStatus } from '../../typings/enums';
import PlantContext from '../../contexts/PlantContext';

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
    const { params, offlineState, api } = useCommonHooks();
    const { permissions } = useContext(PlantContext);
    const checklistApi: ChecklistV2Api = {
        postMultiVerify: api.postMultiVerify,
        postMultiSign: api.postMultiSign,
        putChecklistComment: api.putChecklistComment,
        postUnsign: api.postUnsign,
        postSign: api.postSign,
        getCanMultiSign: api.getCanMultiSign,
        postUnverify: api.postUnverify,
        postVerify: api.postVerify,
        getCanMultiVerify: api.getCanMultiVerify,
        getChecklist: api.getChecklist,
        postSetOk: api.postSetOk,
        postCustomSetOk: api.postCustomSetOk,
        postClear: api.postClear,
        postCustomClear: api.postCustomClear,
        postSetNA: api.postSetNA,
        putMetaTableStringCell: api.putMetaTableStringCell,
        putMetaTableDateCell: api.putMetaTableDateCell,
        getNextCustomItemNumber: api.getNextCustomItemNumber,
        postCustomCheckItem: api.postCustomCheckItem,
        deleteCustomCheckItem: api.deleteCustomCheckItem,
        getChecklistAttachments: api.getChecklistAttachments,
        getChecklistAttachment: api.getChecklistAttachment,
        postChecklistAttachment: api.postChecklistAttachment,
        deleteChecklistAttachment: api.deleteChecklistAttachment,
    };
    return (
        <>
            <ChecklistV2
                refreshChecklistStatus={refreshChecklistStatus}
                setSnackbarText={setSnackbarText}
                permissions={permissions}
                api={checklistApi}
                offlineState={offlineState == OfflineStatus.OFFLINE}
                plantId={params.plant}
                checklistId={params.checklistId}
            />
            <BottomSpacer />
        </>
    );
};

export default ChecklistWrapper;
