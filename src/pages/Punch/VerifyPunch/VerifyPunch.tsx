import { Button } from '@equinor/eds-core-react';
import { CancelToken } from 'axios';
import React, { useState } from 'react';
import styled from 'styled-components';
import { AsyncStatus } from '../../../contexts/McAppContext';
import { Attachment, PunchItem } from '../../../services/apiTypes';
import useCommonHooks from '../../../utils/useCommonHooks';
import { PunchAction } from '../ClearPunch/useClearPunchFacade';
import useSnackbar from '../../../utils/useSnackbar';
import removeSubdirectories from '../../../utils/removeSubdirectories';
import { Attachments } from '@equinor/procosys-webapp-components';
import AsyncPage from '../../../components/AsyncPage';

const VerifyPunchWrapper = styled.main`
    padding: 16px 4%;
    & p {
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
    fetchPunchItemStatus: AsyncStatus;
};

const VerifyPunch = ({
    punchItem,
    fetchPunchItemStatus,
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

    return (
        <AsyncPage
            fetchStatus={fetchPunchItemStatus}
            errorMessage={'Unable to load punch'}
        >
            <>
                {punchItem ? (
                    <VerifyPunchWrapper>
                        <label>Category:</label>
                        <p>{punchItem.status}</p>
                        <label>Type:</label>
                        <p>
                            {punchItem.typeCode}. {punchItem.typeDescription}
                        </p>
                        <label>Description:</label>
                        <p>{punchItem.description}</p>
                        <label>Raised By:</label>
                        <p>
                            {punchItem.raisedByCode}.{' '}
                            {punchItem.raisedByDescription}
                        </p>
                        <label>Clearing by:</label>
                        <p>
                            {punchItem.clearingByCode}.{' '}
                            {punchItem.clearingByDescription}
                        </p>
                        <label>Signatures:</label>
                        {punchItem.clearedAt ? (
                            <p>
                                Cleared at{' '}
                                {new Date(
                                    punchItem.clearedAt
                                ).toLocaleDateString('en-GB')}{' '}
                                by {punchItem.clearedByFirstName}{' '}
                                {punchItem.clearedByLastName} (
                                {punchItem.clearedByUser})
                            </p>
                        ) : null}

                        <Attachments
                            readOnly
                            getAttachments={(
                                cancelToken: CancelToken
                            ): Promise<Attachment[]> =>
                                api.getPunchAttachments(
                                    params.plant,
                                    punchItem.id.toString(),
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
                                    params.punchItemId,
                                    attachmentId
                                )
                            }
                            setSnackbarText={setSnackbarText}
                        />
                        <ButtonGroup>
                            <Button
                                disabled={
                                    punchActionStatus === AsyncStatus.LOADING
                                }
                                onClick={(): Promise<void> =>
                                    handlePunchAction(PunchAction.UNCLEAR, () =>
                                        history.push(
                                            removeSubdirectories(url, 1) +
                                                '/clear'
                                        )
                                    )
                                }
                            >
                                Unclear
                            </Button>
                            <Button
                                disabled={
                                    punchActionStatus === AsyncStatus.LOADING
                                }
                                onClick={(): Promise<void> =>
                                    handlePunchAction(PunchAction.REJECT, () =>
                                        history.push(
                                            removeSubdirectories(url, 1) +
                                                '/clear'
                                        )
                                    )
                                }
                            >
                                Reject
                            </Button>

                            <Button
                                disabled={
                                    punchActionStatus === AsyncStatus.LOADING
                                }
                                onClick={(): Promise<void> =>
                                    handlePunchAction(
                                        PunchAction.VERIFY,
                                        () => {
                                            history.push(
                                                removeSubdirectories(url, 2)
                                            );
                                        }
                                    )
                                }
                            >
                                Verify
                            </Button>
                        </ButtonGroup>
                    </VerifyPunchWrapper>
                ) : null}
                {snackbar}
            </>
        </AsyncPage>
    );
};

export default VerifyPunch;
