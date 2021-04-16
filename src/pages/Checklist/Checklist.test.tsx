import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { withPlantContext } from '../../test/contexts';
import { dummySignedChecklistResponse } from '../../test/dummyData';
import { causeApiError, ENDPOINTS, rest, server } from '../../test/setupServer';
import Checklist from './Checklist';

// Note: Metatable tests are located at component level

jest.useFakeTimers();

describe('<Checklist/> loading errors', () => {
    it('Renders an error message if failing to load checklist', async () => {
        causeApiError(ENDPOINTS.getChecklist, 'get');
        render(withPlantContext({ Component: <Checklist /> }));
        const errorMessage = await screen.findByText(
            'Unable to load checklist. Please reload or try again later.'
        );
        expect(errorMessage).toBeInTheDocument();
    });
    it('Renders an error message if failing to load attachments', async () => {
        causeApiError(ENDPOINTS.getChecklistAttachments, 'get');
        render(withPlantContext({ Component: <Checklist /> }));
        const errorMessage = await screen.findByText(
            'Unable to load attachments for this checklist.'
        );
        expect(errorMessage).toBeInTheDocument();
    });
});

describe('<Checklist/> after loading', () => {
    beforeEach(async () => {
        render(withPlantContext({ Component: <Checklist /> }));
        const tagDescription = await screen.findByText('dummy-tag-description');
        expect(tagDescription).toBeInTheDocument();
        const attachmentImage = await screen.findByAltText(
            'Dummy image thumbnail'
        );
        expect(attachmentImage).toBeInTheDocument();
    });
    it('Renders check item header', async () => {
        const checkItemHeader = await screen.findByText(
            'dummy-check-item-header-text'
        );
        expect(checkItemHeader).toBeInTheDocument();
    });
    it('Lets user toggle applicable/not applicable. Disables while loading and disables/enables/clears the OK checkbox accordingly.', async () => {
        const NACheckbox = await screen.findByTestId('NA-2');
        const OkCheckbox = screen.getByTestId('checked-2');
        expect(NACheckbox).not.toBeDisabled();
        expect(NACheckbox).toBeChecked();
        expect(OkCheckbox).toBeDisabled();
        userEvent.click(NACheckbox);
        expect(NACheckbox).toBeDisabled();
        const successMessage = await screen.findByText('Change saved.');
        expect(successMessage).toBeInTheDocument();
        expect(NACheckbox).not.toBeChecked();
        expect(OkCheckbox).not.toBeDisabled();
        expect(OkCheckbox).not.toBeChecked();
    });
    it('Renders error message if unable to clear NA', async () => {
        causeApiError(ENDPOINTS.postClear, 'post');
        const NACheckbox = await screen.findByTestId('NA-2');
        expect(NACheckbox).toBeChecked();
        expect(NACheckbox).toBeEnabled();
        userEvent.click(NACheckbox);
        const errorMessage = await screen.findByText('Error: dummy error');
        expect(errorMessage).toBeInTheDocument();
    });
    it('Renders error message if unable to set check item to NA', async () => {
        causeApiError(ENDPOINTS.postSetNA, 'post');
        const NACheckbox = await screen.findByTestId('NA-2');
        expect(NACheckbox).toBeChecked();
        expect(NACheckbox).toBeEnabled();
        userEvent.click(NACheckbox);
        const successMessage = await screen.findByText('Change saved.');
        expect(successMessage).toBeInTheDocument();
        expect(NACheckbox).not.toBeChecked();
        userEvent.click(NACheckbox);
        const errorMessage = await screen.findByText('Error: dummy error');
        expect(errorMessage).toBeInTheDocument();
    });
    it('Lets user mark a check item as checked, disabling it while loading', async () => {
        const OkCheckbox = await screen.findByTestId('checked-3');
        expect(OkCheckbox).toBeEnabled();
        expect(OkCheckbox).not.toBeChecked();
        userEvent.click(OkCheckbox);
        expect(OkCheckbox).toBeDisabled();
        await screen.findByText('Change saved.');
        expect(OkCheckbox).toBeChecked();
    });
    it('Renders error message if unable to check an enabled item', async () => {
        causeApiError(ENDPOINTS.postSetOk, 'post');
        const OkCheckbox = await screen.findByTestId('checked-3');
        expect(OkCheckbox).toBeEnabled();
        expect(OkCheckbox).not.toBeChecked();
        userEvent.click(OkCheckbox);
        expect(OkCheckbox).toBeDisabled();
        const errorMessage = await screen.findByText('Error: dummy error');
        expect(errorMessage).toBeInTheDocument();
        expect(OkCheckbox).not.toBeChecked();
    });
    it('Lets user toggle the check item description', async () => {
        const showDetailsButton = await screen.findByRole('button', {
            name: 'Show details',
        });
        userEvent.click(showDetailsButton);
        const detailsText = screen.getByText('dummy-details-text');
        expect(detailsText).toBeInTheDocument();
    });
    it('Lets user check all and uncheck all items', async () => {
        const checkAllButton = screen.getByRole('button', {
            name: 'Check all',
        });
        const firstCheckItem = screen.getByTestId('checked-2');
        const secondCheckItem = screen.getByTestId('checked-3');
        expect(firstCheckItem).toBeDisabled();
        expect(secondCheckItem).toBeEnabled();
        expect(secondCheckItem).not.toBeChecked();
        userEvent.click(checkAllButton);
        expect(checkAllButton).toBeDisabled();
        await screen.findByText('Changes saved.');
        expect(firstCheckItem).toBeDisabled();
        expect(secondCheckItem).toBeChecked();
        const uncheckAllButton = screen.getByRole('button', {
            name: 'Uncheck all',
        });
        userEvent.click(uncheckAllButton);
        await screen.findByText('Uncheck complete.');
        expect(firstCheckItem).toBeDisabled();

        expect(secondCheckItem).not.toBeChecked();
    });

    it('Does not save comment unless the comment changes something', async () => {
        const commentField = screen.getByRole('textbox', { name: 'Comment' });
        expect(commentField).toBeEnabled();
        userEvent.click(commentField);
        userEvent.tab();
        expect(commentField).toBeEnabled();
    });

    it('Lets user update the comment with new text', async () => {
        const commentField = screen.getByRole('textbox', { name: 'Comment' });
        expect(commentField).toBeEnabled();
        userEvent.click(commentField);
        userEvent.type(commentField, 'Some dummy comment.');
        userEvent.tab();
        expect(commentField).toBeDisabled();
        const loadingText = screen.getByText('Saving.');
        expect(loadingText).toBeInTheDocument();
        const successText = await screen.findByText('Comment saved.');
        expect(successText).toBeInTheDocument();
        expect(commentField).toBeEnabled();
        expect(commentField.innerHTML).toEqual('Some dummy comment.');
        const updatedByText = await screen.findByText('Updated by', {
            exact: false,
        });
        expect(updatedByText).toBeInTheDocument();
    });

    it('Renders error message if unable to save comment', async () => {
        causeApiError(ENDPOINTS.putChecklistComment, 'put');
        const commentField = screen.getByRole('textbox', { name: 'Comment' });
        expect(commentField).toBeEnabled();
        userEvent.click(commentField);
        userEvent.type(commentField, 'Some dummy comment.');
        userEvent.tab();
        expect(commentField).toBeDisabled();
        const loadingText = screen.getByText('Saving.');
        expect(loadingText).toBeInTheDocument();
        const successText = await screen.findByText('Unable to save comment.');
        expect(successText).toBeInTheDocument();
        expect(commentField).toBeEnabled();
        expect(commentField.innerHTML).toEqual('Some dummy comment.');
        const updatedByText = await screen.findByText('Updated by', {
            exact: false,
        });
        expect(updatedByText).toBeInTheDocument();
    });
    it('Lets user sign/unsign a checklist, showing relevant messages', async () => {
        const signButton = screen.getByRole('button', { name: 'Sign' });
        expect(signButton).toBeDisabled();
        const applicableMustBeCheckedWarning = screen.getByText(
            'All applicable items must be checked before signing.'
        );
        expect(applicableMustBeCheckedWarning).toBeInTheDocument();
        const missingCheckItem = screen.getByTestId('checked-3');
        expect(missingCheckItem).toBeEnabled();
        expect(missingCheckItem).not.toBeChecked();
        userEvent.click(missingCheckItem);
        await screen.findByText('Change saved.');
        expect(applicableMustBeCheckedWarning).not.toBeInTheDocument();
        expect(signButton).toBeEnabled();
        server.use(
            rest.get(ENDPOINTS.getChecklist, (_, response, context) => {
                return response(context.json(dummySignedChecklistResponse));
            })
        );
        userEvent.click(signButton);
        expect(signButton).toBeDisabled();
        await screen.findByText('Signing complete.');
        const checklistIsSignedBanner = await screen.findByText(
            'This checklist is signed. Unsign to make changes.'
        );
        expect(checklistIsSignedBanner).toBeInTheDocument();
        const commentField = screen.getByRole('textbox', { name: 'Comment' });
        expect(commentField).toBeDisabled();
        await screen.findByText('Signed by', { exact: false });
    });
    test.todo('It renders an error message if unable to sign');
    test.todo('It renders an error message if unable to unsign');
});
