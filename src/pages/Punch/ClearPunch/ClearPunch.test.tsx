import { render, screen } from '@testing-library/react';
import React from 'react';
import { withPlantContext } from '../../../test/contexts';
import { dummyPunchItemCleared } from '../../../test/dummyData';
import {
    causeApiError,
    ENDPOINTS,
    rest,
    server,
} from '../../../test/setupServer';
import ClearPunch from './ClearPunch';

jest.mock('../../../utils/removeSubdirectories', () => {
    return (str: string, num: number): string => '/';
});
describe('<ClearPunch/> loading errors', () => {
    it('Renders an error message if unable to load punch item', async () => {
        render(withPlantContext({ Component: <ClearPunch /> }));
        causeApiError(ENDPOINTS.getPunchItem, 'get');
        const errorMessage = await screen.findByText(
            'Unable to load punch item.'
        );
        expect(errorMessage).toBeInTheDocument();
    });
    it('Renders an error message if unable to load punch attachments', async () => {
        render(withPlantContext({ Component: <ClearPunch /> }));
        causeApiError(ENDPOINTS.getPunchAttachments, 'get');
        const errorMessage = await screen.findByText(
            'Unable to load attachments.'
        );
        expect(errorMessage).toBeInTheDocument();
    });
});

describe('<ClearPunch/> after loading', () => {
    beforeEach(async () => {
        render(withPlantContext({ Component: <ClearPunch /> }));
        const tagDescription = await screen.findByText(
            'For testing purposes (test 37221)'
        );
        expect(tagDescription).toBeInTheDocument();
    });
    it('Renders description on punch item', async () => {
        const descriptionField = screen.getByRole('textbox', {
            name: 'Description',
        });
        expect(descriptionField.innerHTML).toEqual('dummy-punch-description');
    });
    test.todo('Test the different actions (verify, unclear, reject)');
});
