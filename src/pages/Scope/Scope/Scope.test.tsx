import { withPlantContext } from '../../../test/contexts';
import Scope from './Scope';
import React from 'react';
import { findByText, render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { server, ENDPOINTS, causeApiError } from '../../../test/setupServer';
import GeneralRouter from '../../../GeneralRouter';
import { MemoryRouter, Route } from 'react-router-dom';
import { SearchType } from '../../Search/Search';
import { testScope } from '../../../test/dummyData';

const renderScope = (searchType: SearchType, itemId: string): void => {
    render(
        withPlantContext({
            Component: (
                <MemoryRouter
                    initialEntries={[`/plant/project/${searchType}/${itemId}`]}
                >
                    <Route path="/:plant/:project/:searchType/:itemId">
                        <Scope />
                    </Route>
                </MemoryRouter>
            ),
        })
    );
};

describe('<Scope />', () => {
    it('Renders a checklist preview button with tag description', async () => {
        console.log('new test');
        renderScope(SearchType.MC, '33');
        const previewButton = await screen.findByText(
            testScope[0].tagDescription
        );
        expect(previewButton).toBeInTheDocument();
    });
    it('Renders placeholder text when an empty scope is returned from API', async () => {
        console.log('new test');
        server.use(
            rest.get(ENDPOINTS.getMcScope, (request, response, context) => {
                console.log('endpint');
                return response(context.json([]), context.status(200));
            })
        );
        renderScope(SearchType.MC, '33');
        const noContentMessage = await screen.findByText('The scope is empty.');
        expect(noContentMessage).toBeInTheDocument();
    });
    it('Renders error message if unable to get scope', async () => {
        console.log('new test');
        causeApiError(ENDPOINTS.getMcScope, 'get');
        renderScope(SearchType.MC, '33');
        const errorMessage = await screen.findByText(
            'Unable to load scope. Please try again.'
        );
        expect(errorMessage).toBeInTheDocument();
    });
});
