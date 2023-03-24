import React, { useState } from 'react';
import { AsyncStatus } from '../../contexts/McAppContext';
import { PunchItem } from '../../services/apiTypes';
import useCommonHooks from '../../utils/useCommonHooks';
import {
    removeSubdirectories,
    useSnackbar,
    VerifyPunch,
    PunchAction,
} from '@equinor/procosys-webapp-components';

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
    const { url, navigate, params, api } = useCommonHooks();
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
        if (!params.plant || !params.punchItemId) {
            setPunchActionStatus(AsyncStatus.ERROR);
            return;
        }
        try {
            await api.postPunchAction(
                params.plant,
                params.punchItemId,
                punchAction
            );
            setPunchActionStatus(AsyncStatus.SUCCESS);
            navigate(newUrl);
        } catch (error) {
            setPunchActionStatus(AsyncStatus.ERROR);
            setSnackbarText(`Couldn't handle ${punchAction}`);
        }
    };

    return (
        <VerifyPunch
            plantId={params.plant ?? 'undefined'}
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
            getPunchAttachments={api.getPunchAttachments}
            getPunchAttachment={api.getPunchAttachment}
            getPunchComments={api.getPunchComments}
            snackbar={snackbar}
            setSnackbarText={setSnackbarText}
            abortController={abortController}
        />
    );
};

export default VerifyPunchWrapper;
