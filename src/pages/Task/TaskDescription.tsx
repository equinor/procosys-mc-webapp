import { Button, Divider } from '@equinor/eds-core-react';
import Axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { AsyncStatus } from '../../contexts/CommAppContext';
import { Task } from '../../services/apiTypes';
import { COLORS } from '../../style/GlobalStyles';
import useCommonHooks from '../../utils/useCommonHooks';

const CommentField = styled.div<{ editable: boolean }>`
    background-color: ${COLORS.lightGrey};
    padding: 12px;
    font-family: 'Equinor';
    min-height: 80px;
    border-bottom: ${(props): string =>
        props.editable ? `1px solid ${COLORS.black}` : 'none'};
`;

const CommentButton = styled(Button)`
    float: right;
    margin-top: 12px;
    :disabled {
        margin-top: 12px;
    }
`;

export type TaskCommentDto = {
    TaskId: number;
    CommentAsHtml: string;
};

type TaskDescriptionProps = {
    task: Task | undefined;
    isSigned: boolean;
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
};

const TaskDescription = ({
    task,
    isSigned,
    setSnackbarText,
}: TaskDescriptionProps): JSX.Element => {
    const { api, params } = useCommonHooks();
    const [putCommentStatus, setPutCommentStatus] = useState(
        AsyncStatus.INACTIVE
    );
    const [editComment, setEditComment] = useState(false);
    const commentRef = useRef<HTMLDivElement>(null);
    const cancelTokenSource = Axios.CancelToken.source();

    useEffect(() => {
        return (): void => {
            cancelTokenSource.cancel();
        };
    }, []);

    const saveComment = async (): Promise<void> => {
        setPutCommentStatus(AsyncStatus.LOADING);
        const dto: TaskCommentDto = {
            TaskId: parseInt(params.taskId),
            CommentAsHtml: commentRef.current
                ? commentRef.current.innerHTML
                : '',
        };
        try {
            await api.putTaskComment(
                cancelTokenSource.token,
                params.plant,
                dto
            );
            setPutCommentStatus(AsyncStatus.SUCCESS);
            setSnackbarText('Comment successfully saved.');
            setEditComment(false);
        } catch (error) {
            if (!Axios.isCancel(error)) {
                setPutCommentStatus(AsyncStatus.ERROR);
                setSnackbarText(error.toString());
            }
        }
    };

    const handleCommentClick = (): void => {
        if (editComment) {
            saveComment();
        } else {
            setEditComment(true);
            //Ensure focus occurs after comment div is made editable
            setTimeout(() => commentRef.current?.focus(), 100);
        }
    };

    if (task) {
        return (
            <>
                <h5>{task.title}</h5>
                <div
                    dangerouslySetInnerHTML={{
                        __html: `<p>${task.descriptionAsHtml}</p>`,
                    }}
                />
                <Divider variant="medium" />
                <div>
                    <label>Comment:</label>
                    <CommentField
                        role="textbox"
                        aria-readonly={!editComment}
                        editable={editComment}
                        contentEditable={editComment}
                        ref={commentRef}
                        dangerouslySetInnerHTML={{
                            __html: task.commentAsHtml,
                        }}
                    />
                    <CommentButton
                        disabled={
                            isSigned || putCommentStatus === AsyncStatus.LOADING
                        }
                        onClick={handleCommentClick}
                    >
                        {editComment ? 'Save comment' : 'Edit comment'}
                    </CommentButton>
                </div>
            </>
        );
    } else {
        return <></>;
    }
};

export default TaskDescription;
