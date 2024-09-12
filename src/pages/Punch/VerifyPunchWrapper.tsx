import React, { useEffect, useState } from 'react';
import useCommonHooks from '../../utils/useCommonHooks';
import {
    removeSubdirectories,
    useSnackbar,
    VerifyPunch,
    PunchAction,
    AsyncStatus,
} from '@equinor/procosys-webapp-components';
import { PunchItem } from '../../services/apiTypesCompletionApi';

type VerifyPunchProps = {
    punchItem: PunchItem;
    canUnclear: boolean;
    canVerify: boolean;
};

const VerifyPunchWrapper = ({
    punchItem,
    canUnclear,
    canVerify,
}: VerifyPunchProps): JSX.Element => {
    const { url, history, params, api, completionApi } = useCommonHooks();
    const [punchActionStatus, setPunchActionStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const { snackbar, setSnackbarText } = useSnackbar();
    const abortController = new AbortController();

    const handlePunchAction = async (
        punchAction: PunchAction,
        newUrl: string
    ): Promise<void> => {
        setPunchActionStatus(AsyncStatus.LOADING);

        try {
            await completionApi.postPunchAction(
                params.plant,
                params.proCoSysGuid,
                punchAction,
                punchItem.rowVersion
            );
            setPunchActionStatus(AsyncStatus.SUCCESS);
            history.push(newUrl);
        } catch (error) {
            if (!(error instanceof Error)) return;
            setSnackbarText(error.message);
            setPunchActionStatus(AsyncStatus.ERROR);
        }
    };

    return (
        <VerifyPunch
            plantId={params.plant}
            punchItem={punchItem}
            canUnclear={canUnclear}
            canVerify={canVerify}
            handleUnclear={(): Promise<void> =>
                handlePunchAction(PunchAction.UNCLEAR, url)
            }
            handleUnverify={(): Promise<void> =>
                handlePunchAction(PunchAction.UNVERIFY, url)
            }
            handleReject={(): Promise<void> =>
                handlePunchAction(
                    PunchAction.REJECT,
                    removeSubdirectories(url, 2) + '/punch-list'
                )
            }
            handleVerify={(): Promise<void> =>
                handlePunchAction(
                    PunchAction.VERIFY,
                    removeSubdirectories(url, 2) + '/punch-list'
                )
            }
            punchActionStatus={punchActionStatus}
            getPunchAttachments={completionApi.getPunchAttachments}
            getPunchAttachment={completionApi.getPunchAttachment}
            getPunchComments={completionApi.getPunchComments}
            snackbar={snackbar}
            setSnackbarText={setSnackbarText}
            abortController={abortController}
        />
    );
};

export default VerifyPunchWrapper;
