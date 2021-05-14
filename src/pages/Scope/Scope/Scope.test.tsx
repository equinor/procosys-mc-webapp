import { withPlantContext } from '../../../test/contexts';
import Scope from './Scope';
import React from 'react';
import { findByText, render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { server, ENDPOINTS, causeApiError } from '../../../test/setupServer';

const renderScope = (): void => {
    render(
        withPlantContext({
            Component: <Scope />,
        })
    );
};

describe('<Scope />', () => {
    it('Renders a checklist preview button with tag description', async () => {
        renderScope();
        const previewButton = await screen.findByText(
            'scope-dummy-tag-description'
        );
        expect(previewButton).toBeInTheDocument();
    });
    it('Renders placeholder text when an empty scope is returned from API', async () => {
        server.use(
            rest.get(ENDPOINTS.getScope, (request, response, context) => {
                return response(context.json([]), context.status(200));
            })
        );
        renderScope();
        const noContentMessage = await screen.findByText('The scope is empty.');
        expect(noContentMessage).toBeInTheDocument();
    });
    it('Renders error message if unable to get scope', async () => {
        causeApiError(ENDPOINTS.getScope, 'get');
        renderScope();
        const errorMessage = await screen.findByText(
            'Unable to load scope. Please try again.'
        );
        expect(errorMessage).toBeInTheDocument();
    });
});
