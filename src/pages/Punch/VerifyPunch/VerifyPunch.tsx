import { Button } from '@equinor/eds-core-react';
import axios, { CancelToken } from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Attachment, { AttachmentsWrapper } from '../../../components/Attachment';
import ErrorPage from '../../../components/error/ErrorPage';
import SkeletonLoadingPage from '../../../components/loading/SkeletonLoader';
import Navbar from '../../../components/navigation/Navbar';
import AsyncCard from '../../../components/AsyncCard';
import { AsyncStatus } from '../../../contexts/CommAppContext';
import { PunchItem } from '../../../services/apiTypes';
import buildEndpoint from '../../../utils/buildEndpoint';
import useAttachments from '../../../utils/useAttachments';
import useCommonHooks from '../../../utils/useCommonHooks';
import { PunchWrapper } from '../ClearPunch/ClearPunch';
import PunchDetailsCard from '../ClearPunch/PunchDetailsCard';
import { PunchAction } from '../ClearPunch/useClearPunchFacade';
import useSnackbar from '../../../utils/useSnackbar';
import removeSubdirectories from '../../../utils/removeSubdirectories';

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

const VerifyPunch = (): JSX.Element => {
    const { url, history, params, api } = useCommonHooks();
    const [fetchPunchItemStatus, setFetchPunchItemStatus] = useState(
        AsyncStatus.LOADING
    );
    const [punchActionStatus, setPunchActionStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const [punchItem, setPunchItem] = useState<PunchItem>();
    const {
        attachments,
        fetchAttachmentsStatus,
        refreshAttachments,
    } = useAttachments(
        buildEndpoint().getPunchAttachments(params.plant, params.punchItemId)
    );
    const { snackbar, setSnackbarText } = useSnackbar();

    useEffect(() => {
        const source = axios.CancelToken.source();
        (async (): Promise<void> => {
            try {
                const punchItemFromApi = await api.getPunchItem(
                    params.plant,
                    params.punchItemId
                );
                setPunchItem(punchItemFromApi);
                setFetchPunchItemStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                setFetchPunchItemStatus(AsyncStatus.ERROR);
            }
        })();
        return (): void => {
            source.cancel('Verify Punch component unmounted');
        };
    }, [params.plant, params.punchItemId, api]);

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

    const content = (): JSX.Element => {
        if (
            fetchPunchItemStatus === AsyncStatus.SUCCESS &&
            punchItem &&
            punchItem.clearedAt
        ) {
            return (
                <>
                    <PunchDetailsCard
                        systemModule={punchItem.systemModule}
                        tagDescription={punchItem.tagDescription}
                    ></PunchDetailsCard>
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
                        <p>
                            Cleared at{' '}
                            {new Date(punchItem.clearedAt).toLocaleDateString(
                                'en-GB'
                            )}{' '}
                            by {punchItem.clearedByFirstName}{' '}
                            {punchItem.clearedByLastName} (
                            {punchItem.clearedByUser})
                        </p>
                        <AsyncCard
                            fetchStatus={fetchAttachmentsStatus}
                            cardTitle={'Attachments'}
                            errorMessage={
                                'Unable to load attachments for this punch'
                            }
                        >
                            <AttachmentsWrapper>
                                {attachments.map((attachment) => (
                                    <Attachment
                                        setSnackbarText={setSnackbarText}
                                        attachment={attachment}
                                        key={attachment.id}
                                        refreshAttachments={refreshAttachments}
                                        getAttachment={(
                                            cancelToken: CancelToken
                                        ): Promise<Blob> =>
                                            api.getPunchAttachment(
                                                cancelToken,
                                                params.plant,
                                                params.punchItemId,
                                                attachment.id
                                            )
                                        }
                                    />
                                ))}
                            </AttachmentsWrapper>
                        </AsyncCard>
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
                </>
            );
        } else if (fetchPunchItemStatus === AsyncStatus.ERROR) {
            return <ErrorPage title="Unable to load punch item." />;
        } else {
            return <SkeletonLoadingPage text="Loading punch item" />;
        }
    };

    return (
        <>
            <Navbar
                noBorder
                leftContent={{
                    name: 'back',
                    label: 'Punch list',
                    url: removeSubdirectories(url, 2),
                }}
            />
            <PunchWrapper>{content()}</PunchWrapper>
            {snackbar}
        </>
    );
};

export default VerifyPunch;
