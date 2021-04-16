import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Navbar from '../../components/navigation/Navbar';
import useCommonHooks from '../../utils/useCommonHooks';
import TaskDescription from './TaskDescription';
import TaskParameters from './TaskParameters/TaskParameters';
import TaskSignature from './TaskSignature';
import Attachment, { AttachmentsWrapper } from '../../components/Attachment';
import { Task as TaskType, TaskPreview } from '../../services/apiTypes';
import { AsyncStatus } from '../../contexts/CommAppContext';
import EdsIcon from '../../components/icons/EdsIcon';
import AsyncCard from '../../components/AsyncCard';
import useSnackbar from '../../utils/useSnackbar';
import { TaskPreviewButton } from '../CommPkg/Tasks/Tasks';
import { Banner, Typography } from '@equinor/eds-core-react';
import Axios, { CancelToken } from 'axios';
import useAsyncGet from '../../utils/useAsyncGet';
import removeSubdirectories from '../../utils/removeSubdirectories';
const { BannerIcon, BannerMessage } = Banner;

const NextTaskButton = styled(TaskPreviewButton)`
    padding: 0;
    margin: 0;
    & > div {
        margin: 0;
    }
`;

const TaskWrapper = styled.main`
    padding: 16px 4%;
`;

const findNextTask = (
    tasks: TaskPreview[],
    currentTaskId: string
): TaskPreview | null => {
    const indexOfCurrentTask = tasks.findIndex(
        (task) => task.id === parseInt(currentTaskId)
    );
    if (indexOfCurrentTask < 0) return null;
    const nextTask = tasks[indexOfCurrentTask + 1];
    if (nextTask) return nextTask;
    return null;
};

const Task = (): JSX.Element => {
    const { url, api, params } = useCommonHooks();
    const {
        response: attachments,
        fetchStatus: fetchAttachmentsStatus,
    } = useAsyncGet((cancelToken: CancelToken) =>
        api.getTaskAttachments(cancelToken, params.plant, params.taskId)
    );
    const {
        response: parameters,
        fetchStatus: fetchParametersStatus,
    } = useAsyncGet((token) =>
        api.getTaskParameters(token, params.plant, params.taskId)
    );
    const [task, setTask] = useState<TaskType>();
    const [nextTask, setNextTask] = useState<TaskPreview | null>(null);
    const [fetchNextTaskStatus, setFetchNextTaskStatus] = useState(
        AsyncStatus.LOADING
    );
    const [fetchTaskStatus, setFetchTaskStatus] = useState(AsyncStatus.LOADING);
    const [isSigned, setIsSigned] = useState(false);
    const [refreshTask, setRefreshTask] = useState(false);
    const { snackbar, setSnackbarText } = useSnackbar();
    const source = Axios.CancelToken.source();

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const taskFromApi = await api.getTask(
                    source.token,
                    params.plant,
                    params.taskId
                );
                setTask(taskFromApi);
                setFetchTaskStatus(AsyncStatus.SUCCESS);
                setIsSigned(!!taskFromApi.signedByUser);
            } catch (error) {
                if (!Axios.isCancel(error)) {
                    setFetchTaskStatus(AsyncStatus.ERROR);
                    setSnackbarText('Unable to load task');
                }
            }
        })();
        return (): void => {
            source.cancel();
        };
    }, [api, params.plant, params.taskId, refreshTask]);

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const tasksFromApi = await api.getTasks(
                    source.token,
                    params.plant,
                    params.commPkg
                );
                if (tasksFromApi.length < 1) {
                    setNextTask(null);
                } else {
                    setNextTask(findNextTask(tasksFromApi, params.taskId));
                }
                setFetchNextTaskStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                if (!Axios.isCancel(error)) {
                    setFetchNextTaskStatus(AsyncStatus.ERROR);
                    setSnackbarText('Unable to load next task.');
                }
            }
        })();
        return (): void => {
            source.cancel();
        };
    }, [api, params.taskId, params.plant, params.commPkg]);

    return (
        <>
            <Navbar
                noBorder
                leftContent={{
                    name: 'back',
                    label: 'Tasks',
                    url: removeSubdirectories(url, 1),
                }}
            />
            {isSigned ? (
                <Banner>
                    <BannerIcon variant={'info'}>
                        <EdsIcon name={'info_circle'} />
                    </BannerIcon>
                    <BannerMessage>
                        This task is signed. Unsign to make changes.
                    </BannerMessage>
                </Banner>
            ) : null}
            <TaskWrapper>
                <AsyncCard
                    cardTitle={task ? `Task ${task.number}` : 'Task'}
                    errorMessage={'Unable to load task description.'}
                    fetchStatus={fetchTaskStatus}
                >
                    <TaskDescription
                        task={task}
                        isSigned={isSigned}
                        setSnackbarText={setSnackbarText}
                    />
                </AsyncCard>
                <AsyncCard
                    errorMessage={'Unable to load task signature.'}
                    fetchStatus={fetchTaskStatus}
                    cardTitle={'Signature'}
                >
                    {task ? (
                        <TaskSignature
                            fetchTaskStatus={fetchTaskStatus}
                            isSigned={isSigned}
                            task={task}
                            setIsSigned={setIsSigned}
                            setSnackbarText={setSnackbarText}
                            refreshTask={setRefreshTask}
                        />
                    ) : (
                        <></>
                    )}
                </AsyncCard>

                {fetchAttachmentsStatus !== AsyncStatus.EMPTY_RESPONSE ? (
                    <AsyncCard
                        fetchStatus={fetchAttachmentsStatus}
                        errorMessage={
                            'Unable to load attachments. Please refresh or try again later.'
                        }
                        emptyContentMessage={'This task has no attachments.'}
                        cardTitle={'Attachments'}
                    >
                        <AttachmentsWrapper>
                            {attachments?.map((attachment) => (
                                <Attachment
                                    setSnackbarText={setSnackbarText}
                                    attachment={attachment}
                                    key={attachment.id}
                                    getAttachment={(
                                        cancelToken: CancelToken
                                    ): Promise<Blob> =>
                                        api.getTaskAttachment(
                                            cancelToken,
                                            params.plant,
                                            params.taskId,
                                            attachment.id
                                        )
                                    }
                                />
                            ))}
                        </AttachmentsWrapper>
                    </AsyncCard>
                ) : null}

                {fetchParametersStatus !== AsyncStatus.EMPTY_RESPONSE &&
                parameters ? (
                    <AsyncCard
                        fetchStatus={fetchParametersStatus}
                        errorMessage={
                            'Unable to load parameters. Please refresh or try again later.'
                        }
                        emptyContentMessage={'This task has no parameters'}
                        cardTitle={'Parameters'}
                    >
                        <TaskParameters
                            setSnackbarText={setSnackbarText}
                            isSigned={isSigned}
                            parameters={parameters}
                        />
                    </AsyncCard>
                ) : null}

                <AsyncCard
                    cardTitle={'Next task'}
                    fetchStatus={fetchNextTaskStatus}
                    errorMessage={
                        'Unable to retrieve next task. Please go back to task list.'
                    }
                >
                    {nextTask ? (
                        <NextTaskButton
                            to={`${removeSubdirectories(url, 1)}/${
                                nextTask.id
                            }`}
                        >
                            <div>
                                <label>{nextTask.number}</label>
                                <Typography variant="body_short" lines={3}>
                                    {nextTask.title}
                                </Typography>
                            </div>
                            <EdsIcon name="arrow_forward" />
                        </NextTaskButton>
                    ) : (
                        <p>This is the last task in the list.</p>
                    )}
                </AsyncCard>
            </TaskWrapper>
            {snackbar}
        </>
    );
};

export default Task;
