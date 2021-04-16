import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { withPlantContext } from '../../../test/contexts';
import { causeApiError, ENDPOINTS } from '../../../test/setupServer';
import NewPunch from './NewPunch';
describe('<NewPunch/> loading errors', () => {
    it('Renders an error message if unable to load checklist details', async () => {
        render(withPlantContext({ Component: <NewPunch /> }));
        causeApiError(ENDPOINTS.getChecklist, 'get');
        const errorMessage = await screen.findByText(
            'Unable to load new punch. Please check your connection, permissions, or refresh this page.'
        );
        expect(errorMessage).toBeInTheDocument();
    });
    it('Renders an error message if unable to load punch categories', async () => {
        render(withPlantContext({ Component: <NewPunch /> }));
        causeApiError(ENDPOINTS.getPunchCategories, 'get');
        const errorMessage = await screen.findByText(
            'Unable to load new punch. Please check your connection, permissions, or refresh this page.'
        );
        expect(errorMessage).toBeInTheDocument();
    });
});
describe('<NewPunch/> after loading', () => {
    beforeEach(async () => {
        render(withPlantContext({ Component: <NewPunch /> }));
        const tagNumber = await screen.findByText('dummy-tag-no');
        expect(tagNumber).toBeInTheDocument();
    });
    it('Allows user to set a description', async () => {
        const descriptionBox = screen.getByRole('textbox', {
            name: 'Description',
        });
        userEvent.type(descriptionBox, 'Dummy text');
        userEvent.tab();
        expect(descriptionBox.innerHTML).toEqual('Dummy text');
    });
    test.todo(
        'Fill out all fields, upload attachments and post the attachment. Make sure the attachment ID is sent with the request. Check if the success page renders afterwards'
    );
});
