import { Button } from '@equinor/eds-core-react';
import { CancelToken } from 'axios';
import React, { useState } from 'react';
import styled from 'styled-components';
import { AsyncStatus } from '../../../contexts/McAppContext';
import { Attachment, PunchItem } from '../../../services/apiTypes';
import useCommonHooks from '../../../utils/useCommonHooks';
import useSnackbar from '../../../utils/useSnackbar';
import removeSubdirectories from '../../../utils/removeSubdirectories';
import { Attachments } from '@equinor/procosys-webapp-components';
import { PunchAction } from '../ClearPunch/useClearPunchFacade';

const VerifyPunchWrapper = styled.div`
    padding: 16px 4% 78px 4%;
    & > p {
        margin-top: 0;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    margin-top: 24px;
    justify-content: flex-end;
    & button,
    button:disabled {
        margin-left: 12px;
    }
`;

type VerifyPunchProps = {
    punchItem: PunchItem;
    canUnclear: boolean;
    canVerify: boolean;
};

const VerifyPunch = ({
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
        nextStep: () => void
    ): Promise<void> => {
        setPunchActionStatus(AsyncStatus.LOADING);
        try {
            await api.postPunchAction(
                params.plant,
                params.punchItemId,
                punchAction
            );
            setPunchActionStatus(AsyncStatus.SUCCESS);
            nextStep();
        } catch (error) {
            setPunchActionStatus(AsyncStatus.ERROR);
        }
    };

    const determineButtonsToRender = (): JSX.Element => {
        if (punchItem.verifiedByFirstName) {
            return (
                <Button
                    disabled={
                        punchActionStatus === AsyncStatus.LOADING ||
                        canVerify === false
                    }
                    onClick={(): Promise<void> =>
                        handlePunchAction(PunchAction.UNVERIFY, () => {
                            history.push(url);
                        })
                    }
                >
                    Unverify
                </Button>
            );
        } else {
            return (
                <>
                    <Button
                        disabled={
                            punchActionStatus === AsyncStatus.LOADING ||
                            canUnclear === false
                        }
                        onClick={(): Promise<void> =>
                            handlePunchAction(PunchAction.UNCLEAR, () =>
                                history.push(url)
                            )
                        }
                    >
                        Unclear
                    </Button>
                    <Button
                        disabled={
                            punchActionStatus === AsyncStatus.LOADING ||
                            canVerify === false
                        }
                        onClick={(): Promise<void> =>
                            handlePunchAction(PunchAction.REJECT, () =>
                                history.push(
                                    removeSubdirectories(url, 2) + '/punch-list'
                                )
                            )
                        }
                    >
                        Reject
                    </Button>

                    <Button
                        disabled={
                            punchActionStatus === AsyncStatus.LOADING ||
                            canVerify === false
                        }
                        onClick={(): Promise<void> =>
                            handlePunchAction(PunchAction.VERIFY, () => {
                                history.push(
                                    removeSubdirectories(url, 2) + '/punch-list'
                                );
                            })
                        }
                    >
                        Verify
                    </Button>
                </>
            );
        }
    };

    return (
        <VerifyPunchWrapper>
            <label>Category:</label>
            <p>{punchItem.status}</p>
            <label>Description:</label>
            <p>{punchItem.description}</p>
            <label>Raised By:</label>
            <p>
                {punchItem.raisedByCode}. {punchItem.raisedByDescription}
            </p>
            <label>Clearing by:</label>
            <p>
                {punchItem.clearingByCode}. {punchItem.clearingByDescription}
            </p>
            <label>Action by person:</label>
            <p>
                {punchItem.actionByPerson
                    ? `${punchItem.actionByPersonFirstName} ${punchItem.actionByPersonLastName}`
                    : '--'}
            </p>
            <label>Due date:</label>
            <p>{punchItem.dueDate ?? '--'}</p>
            <label>Type:</label>
            <p>
                {punchItem.typeCode}. {punchItem.typeDescription}
            </p>
            <label>Sorting:</label>
            <p>{punchItem.sorting ?? '--'}</p>
            <label>Priority:</label>
            <p>
                {punchItem.priorityCode
                    ? `${punchItem.priorityCode} . ${punchItem.priorityDescription}`
                    : '--'}
            </p>
            <label>Estimate:</label>
            <p>{punchItem.estimate ?? '--'}</p>
            <label>Signatures:</label>
            {punchItem.clearedAt ? (
                <p>
                    Cleared at{' '}
                    {new Date(punchItem.clearedAt).toLocaleDateString('en-GB')}{' '}
                    by {punchItem.clearedByFirstName}{' '}
                    {punchItem.clearedByLastName} ({punchItem.clearedByUser})
                </p>
            ) : null}
            {punchItem.verifiedAt ? (
                <p>
                    Verified at{' '}
                    {new Date(punchItem.verifiedAt).toLocaleDateString()} by{' '}
                    {punchItem.verifiedByFirstName}{' '}
                    {punchItem.verifiedByLastName} ({punchItem.verifiedByUser})
                </p>
            ) : null}
            {punchItem.rejectedAt ? (
                <p>
                    Rejected at{' '}
                    {new Date(punchItem.rejectedAt).toLocaleDateString('en-GB')}{' '}
                    by {punchItem.rejectedByFirstName}{' '}
                    {punchItem.rejectedByLastName} ({punchItem.rejectedByUser})
                </p>
            ) : null}

            <Attachments
                readOnly
                getAttachments={(
                    cancelToken: CancelToken
                ): Promise<Attachment[]> =>
                    api.getPunchAttachments(
                        params.plant,
                        punchItem.id,
                        cancelToken
                    )
                }
                getAttachment={(
                    cancelToken: CancelToken,
                    attachmentId: number
                ): Promise<Blob> =>
                    api.getPunchAttachment(
                        cancelToken,
                        params.plant,
                        parseInt(params.punchItemId),
                        attachmentId
                    )
                }
                setSnackbarText={setSnackbarText}
            />
            <ButtonGroup>{determineButtonsToRender()}</ButtonGroup>
            {snackbar}
        </VerifyPunchWrapper>
    );
};

export default VerifyPunch;
