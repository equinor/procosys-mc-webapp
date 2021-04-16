import {
    findByRole,
    render,
    screen,
    waitForElementToBeRemoved,
} from '@testing-library/react';
import { withPlantContext } from '../../test/contexts';
import Task from './Task';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { causeApiError, ENDPOINTS, rest, server } from '../../test/setupServer';

const renderTask = async (): Promise<void> => {
    render(withPlantContext({ Component: <Task /> }));
    expect(
        await screen.findByText('dummy-task-description')
    ).toBeInTheDocument();
};

const editAndSaveComment = async (): Promise<void> => {
    const editButton = screen.getByRole('button', {
        name: 'Edit comment',
    });
    userEvent.click(editButton);
    const saveButton = screen.getByRole('button', { name: 'Save comment' });
    userEvent.click(saveButton);
};

describe('<Task/> loading errors', () => {
    it('Renders error message if unable to load task', async () => {
        causeApiError(ENDPOINTS.getTask, 'get');
        render(withPlantContext({ Component: <Task /> }));
        const errorMessageInSnackbar = await screen.findByText(
            'Unable to load task'
        );
        expect(errorMessageInSnackbar).toBeInTheDocument();
    });

    it('Renders error message if unable to load task attachments', async () => {
        causeApiError(ENDPOINTS.getTaskAttachments, 'get');
        render(withPlantContext({ Component: <Task /> }));
        const errorMessageInCard = await screen.findByText(
            'Unable to load attachments. Please refresh or try again later.'
        );
        expect(errorMessageInCard).toBeInTheDocument();
    });

    it('Renders error message if unable to load next task', async () => {
        causeApiError(ENDPOINTS.getTasks, 'get');
        render(withPlantContext({ Component: <Task /> }));
        const errorMessageInCard = await screen.findByText(
            'Unable to retrieve next task. Please go back to task list.'
        );
        expect(errorMessageInCard).toBeInTheDocument();
    });
});

describe('<Task/> after successful loading', () => {
    beforeEach(async () => {
        await renderTask();
    });

    it('Allows user to edit and save a comment', async () => {
        await editAndSaveComment();
        const messageInSnackbar = await screen.findByText(
            'Comment successfully saved.'
        );
        expect(messageInSnackbar).toBeInTheDocument();
    });

    it('Renders error message if user is unable to edit and save a comment', async () => {
        causeApiError(ENDPOINTS.putTaskComment, 'put');
        await editAndSaveComment();
        const messageInSnackbar = await screen.findByText('Error: dummy error');
        expect(messageInSnackbar).toBeInTheDocument();
    });

    it('Allows user to sign and unsign the task, enabling and disabling the comment button', async () => {
        const editButton = screen.getByRole('button', {
            name: 'Edit comment',
        });
        expect(editButton).toBeEnabled();
        const signButton = screen.getByRole('button', { name: 'Sign' });
        userEvent.click(signButton);
        let messageInSnackbar = await screen.findByText(
            'Task successfully signed'
        );
        expect(messageInSnackbar).toBeInTheDocument();
        expect(editButton).toBeDisabled();
        const unsignButton = screen.getByRole('button', { name: 'Unsign' });
        userEvent.click(unsignButton);
        messageInSnackbar = await screen.findByText(
            'Task successfully unsigned'
        );
        expect(messageInSnackbar).toBeInTheDocument();
        expect(editButton).toBeEnabled();
    });

    it('Renders error message when task signing fails', async () => {
        causeApiError(ENDPOINTS.postTaskSign, 'post');
        const signButton = screen.getByRole('button', { name: 'Sign' });
        userEvent.click(signButton);
        const errorMessageInSnackbar = await screen.findByText(
            'Error: dummy error'
        );
        expect(errorMessageInSnackbar).toBeInTheDocument();
    });

    it('Renders error message when task unsigning fails', async () => {
        causeApiError(ENDPOINTS.postTaskUnsign, 'post');
        const signButton = screen.getByRole('button', { name: 'Sign' });
        userEvent.click(signButton);
        await screen.findByText('Task successfully signed');
        const unsignButton = screen.getByRole('button', { name: 'Unsign' });
        userEvent.click(unsignButton);
        const errorMessageInSnackbar = await screen.findByText(
            'Error: dummy error'
        );
        expect(errorMessageInSnackbar).toBeInTheDocument();
    });

    it('Allows user to input and save a parameter value.', async () => {
        const measuredInput = screen.getByRole('textbox', {
            name: 'Measured V',
        });
        userEvent.type(measuredInput, '230');
        userEvent.tab();
        const messageInSnackbar = await screen.findByText(
            'Parameter value saved'
        );
        expect(messageInSnackbar).toBeInTheDocument();
    });

    it('Renders error if failing to save parameter input.', async () => {
        causeApiError(ENDPOINTS.putTaskParameter, 'put');
        const measuredInput = screen.getByRole('textbox', {
            name: 'Measured V',
        });
        userEvent.type(measuredInput, '230');
        userEvent.tab();
        const errorMessageInSnackbar = await screen.findByText(
            'Error: dummy error'
        );
        expect(errorMessageInSnackbar).toBeInTheDocument();
    });

    it('Shows a list of attachments', async () => {
        const attachmentImage = await screen.findByAltText(
            'Dummy image thumbnail'
        );
        expect(attachmentImage).toBeInTheDocument();
    });

    it('Shows message if current task is the last task', async () => {
        const lastTaskMessageInCard = await screen.findByText(
            'This is the last task in the list.'
        );
        expect(lastTaskMessageInCard).toBeInTheDocument();
    });
    it('Opens the image in full screen when clicking the thumbnail, and closes the modal when the close button is clicked', async () => {
        const attachmentImage = await screen.findByAltText(
            'Dummy image thumbnail'
        );
        userEvent.click(attachmentImage);
        const closeModalButton = await screen.findByRole('button', {
            name: 'Close',
        });
        expect(closeModalButton).toBeInTheDocument();
        userEvent.click(closeModalButton);
        expect(closeModalButton).not.toBeInTheDocument();
    });

    test.todo('It shows the next task if there is one');
    test.todo(
        'It removes attachments section after loading it if there are no attachments to display'
    );
    test.todo(
        'It removes parameters section after loading it if there are no parameters to display'
    );
});
