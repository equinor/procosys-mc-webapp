import { withPlantContext } from '../../../test/contexts';
import Tasks from './Tasks';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { rest } from 'msw';
import { server, ENDPOINTS, causeApiError } from '../../../test/setupServer';

const renderTasks = (): void => {
    render(
        withPlantContext({
            Component: <Tasks />,
        })
    );
};

describe('<Tasks />', () => {
    it('Renders a checklist preview button with tag description', async () => {
        renderTasks();
        const previewButton = await screen.findByText('dummy-task-number');
        expect(previewButton).toBeInTheDocument();
    });
    it('Renders placeholder text when an empty tasks is returned from API', async () => {
        server.use(
            rest.get(ENDPOINTS.getTasks, (request, response, context) => {
                return response(context.json([]), context.status(200));
            })
        );
        renderTasks();
        const noContentMessage = await screen.findByText(
            'There are no tasks for this CommPkg.'
        );
        expect(noContentMessage).toBeInTheDocument();
    });
    it('Renders error message if unable to get tasks', async () => {
        causeApiError(ENDPOINTS.getTasks, 'get');
        renderTasks();
        const errorMessage = await screen.findByText(
            'Unable to load tasks. Please try again.'
        );
        expect(errorMessage).toBeInTheDocument();
    });
});
