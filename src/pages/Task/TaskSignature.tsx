import { Button } from '@equinor/eds-core-react';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AsyncStatus } from '../../contexts/CommAppContext';
import { Task } from '../../services/apiTypes';
import useCommonHooks from '../../utils/useCommonHooks';

const TaskSignatureWrapper = styled.div`
    overflow: hidden;
    & button,
    button:disabled {
        float: right;
        margin-top: 12px;
    }
`;

type TaskSignatureProps = {
    isSigned: boolean;
    setIsSigned: React.Dispatch<React.SetStateAction<boolean>>;
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
    task: Task;
    fetchTaskStatus: AsyncStatus;
    refreshTask: React.Dispatch<React.SetStateAction<boolean>>;
};

const TaskSignature = ({
    isSigned,
    setIsSigned,
    task,
    setSnackbarText,
    refreshTask,
}: TaskSignatureProps): JSX.Element => {
    const { api, params } = useCommonHooks();
    const [taskSignStatus, setTaskSignStatus] = useState(AsyncStatus.INACTIVE);
    const cancelTokenSource = Axios.CancelToken.source();

    const handleSign = async (): Promise<void> => {
        setTaskSignStatus(AsyncStatus.LOADING);
        try {
            if (isSigned) {
                await api.postTaskUnsign(
                    cancelTokenSource.token,
                    params.plant,
                    params.taskId
                );
                setIsSigned(false);
                setSnackbarText('Task successfully unsigned');
            } else {
                await api.postTaskSign(
                    cancelTokenSource.token,
                    params.plant,
                    params.taskId
                );
                setIsSigned(true);
                setSnackbarText('Task successfully signed');
            }
            refreshTask((prev) => !prev);
            setTaskSignStatus(AsyncStatus.SUCCESS);
        } catch (error) {
            setTaskSignStatus(AsyncStatus.ERROR);
            setSnackbarText(error.toString());
        }
    };

    useEffect(() => {
        return (): void => {
            cancelTokenSource.cancel();
        };
    }, []);

    return (
        <TaskSignatureWrapper>
            {task.signedAt ? (
                <>
                    <p>{`Signed at ${new Date(task.signedAt).toLocaleDateString(
                        'en-GB'
                    )} by ${task.signedByFirstName} ${task.signedByLastName} (${
                        task.signedByUser
                    })`}</p>
                </>
            ) : (
                <>
                    <p>This task is not signed.</p>
                </>
            )}
            <Button
                disabled={taskSignStatus === AsyncStatus.LOADING}
                onClick={handleSign}
            >
                {isSigned ? 'Unsign' : 'Sign'}
            </Button>
        </TaskSignatureWrapper>
    );
};

export default TaskSignature;
