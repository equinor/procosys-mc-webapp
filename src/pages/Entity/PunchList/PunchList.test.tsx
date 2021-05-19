import { withPlantContext } from '../../../test/contexts';
import React from 'react';
import PunchList from './PunchList';
import { screen, render, waitFor } from '@testing-library/react';
import {
    causeApiError,
    ENDPOINTS,
    rest,
    server,
} from '../../../test/setupServer';

const renderPunchList = (): void => {
    render(
        withPlantContext({
            Component: <PunchList />,
        })
    );
};

describe('<PunchList />', () => {
    it('Renders a punch preview button', async () => {
        renderPunchList();
        expect(
            await screen.findByText('dummy-punch-item-description')
        ).toBeInTheDocument();
    });
    it('Renders placeholder text when an empty punch list is returned from API', async () => {
        server.use(
            rest.get(ENDPOINTS.getPunchList, (request, response, context) => {
                return response(context.json([]), context.status(200));
            })
        );
        renderPunchList();
        const noContentMessage = await screen.findByText(
            'The punch list is empty.'
        );
        expect(noContentMessage).toBeInTheDocument();
    });
    it('Renders error message if unable to get punch list', async () => {
        causeApiError(ENDPOINTS.getPunchList, 'get');
        renderPunchList();
        const errorMessage = await screen.findByText(
            'Error: Unable to get punch list. Please try again.'
        );
        expect(errorMessage).toBeInTheDocument();
    });
});
