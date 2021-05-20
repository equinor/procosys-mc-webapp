import React from 'react';
import styled from 'styled-components';
import { CommPkgListWrapper, PreviewButton } from '../Scope/Scope';
import { Typography } from '@equinor/eds-core-react';
import EdsIcon from '../../../components/icons/EdsIcon';
import CompletionStatusIcon from '../../../components/icons/CompletionStatusIcon';
import { CompletionStatus } from '../../../services/apiTypes';
import useCommonHooks from '../../../utils/useCommonHooks';
import AsyncPage from '../../../components/AsyncPage';
import useAsyncGet from '../../../utils/useAsyncGet';
import { CancelToken } from 'axios';

export const TaskPreviewButton = styled(PreviewButton)`
    & > div {
        flex: 2;
    }
`;

const Tasks = (): JSX.Element => {
    const { params, api, url } = useCommonHooks();
    const {
        response: tasks,
        fetchStatus,
    } = useAsyncGet((cancelToken: CancelToken) =>
        api.getTasks(cancelToken, params.plant, params.commPkg)
    );

    return (
        <CommPkgListWrapper>
            <AsyncPage
                errorMessage={'Unable to load tasks. Please try again.'}
                fetchStatus={fetchStatus}
                emptyContentMessage={'There are no tasks for this CommPkg.'}
            >
                <>
                    {tasks?.map((task) => (
                        <TaskPreviewButton
                            to={`${url}/${task.id}`}
                            key={task.id}
                        >
                            {task.isSigned ? (
                                <CompletionStatusIcon
                                    status={CompletionStatus.OK}
                                />
                            ) : (
                                <CompletionStatusIcon
                                    status={CompletionStatus.OS}
                                />
                            )}
                            <div>
                                <label>{task.number}</label>
                                <Typography variant="body_short" lines={3}>
                                    {task.title}
                                </Typography>
                            </div>
                            <EdsIcon name="chevron_right" />
                        </TaskPreviewButton>
                    ))}
                </>
            </AsyncPage>
        </CommPkgListWrapper>
    );
};

export default Tasks;
