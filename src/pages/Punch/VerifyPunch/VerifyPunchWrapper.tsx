import { Button } from '@equinor/eds-core-react';
import axios, { CancelToken } from 'axios';
import React, { useState } from 'react';
import styled from 'styled-components';
import { AsyncStatus } from '../../../contexts/McAppContext';
import { Attachment, PunchItem } from '../../../services/apiTypes';
import useCommonHooks from '../../../utils/useCommonHooks';
import useSnackbar from '../../../utils/useSnackbar';
import removeSubdirectories from '../../../utils/removeSubdirectories';
import { Attachments, VerifyPunch } from '@equinor/procosys-webapp-components';
import { PunchAction } from '../ClearPunch/useClearPunchFacade';

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
    const { url, history, params, api } = useCommonHooks();
    const [punchActionStatus, setPunchActionStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const { snackbar, setSnackbarText } = useSnackbar();

    const handlePunchAction = async (
        punchAction: PunchAction,
        newUrl: string
    ): Promise<void> => {
        setPunchActionStatus(AsyncStatus.LOADING);
        try {
            await api.postPunchAction(
                params.plant,
                params.punchItemId,
                punchAction
            );
            setPunchActionStatus(AsyncStatus.SUCCESS);
            history.push(newUrl);
        } catch (error) {
            setPunchActionStatus(AsyncStatus.ERROR);
            setSnackbarText(`Couldn't handle ${punchAction}`);
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
            getPunchAttachments={api.getPunchAttachments}
            getPunchAttachment={api.getPunchAttachment}
            snackbar={snackbar}
            setSnackbarText={setSnackbarText}
        />
    );
};

export default VerifyPunchWrapper;
