import { withPlantContext } from '../../test/contexts';
import ScopePage from './ScopePage';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { rest } from 'msw';
import { server, ENDPOINTS, causeApiError } from '../../test/setupServer';
import { SearchType } from '../Search/Search';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {
    dummyPunchListResponse,
    testMcPkgPreview,
    testScope,
} from '../../test/dummyData';

const renderScope = (searchType: SearchType): void => {
    render(
        withPlantContext({
            Component: (
                <MemoryRouter
                    initialEntries={[`/plant/project/${searchType}/33`]}
                >
                    <Route path="/:plant/:project/:searchType/:itemId">
                        <ScopePage />
                    </Route>
                    <Route path="/:plant/:project/:searchType/:itemId/punch-list">
                        <ScopePage />
                    </Route>
                </MemoryRouter>
            ),
        })
    );
};

describe('<ScopePage> general and Scope component', () => {
    it('Shows an error message in Scope component, footer, and MC pkg details card if getMcScope API call fails', async () => {
        causeApiError(ENDPOINTS.getMcScope, 'get');
        renderScope(SearchType.MC);
        expect(
            await screen.findByText('Unable to load scope. Please try again.')
        ).toBeInTheDocument();
        expect(
            await screen.findByText('Unable to load footer. Please reload')
        ).toBeInTheDocument();
        expect(
            await screen.findByText('Unable to load details. Please reload')
        ).toBeInTheDocument();
    });
    it('Shows an error message in footer, and MC pkg details card, but not in the Scope component if getMcPkgDetails API call fails', async () => {
        causeApiError(ENDPOINTS.getMcPkgDetails, 'get');
        renderScope(SearchType.MC);
        expect(
            screen.queryByText('Unable to load scope. Please try again.')
        ).not.toBeInTheDocument();
        expect(
            await screen.findByText('Unable to load footer. Please reload')
        ).toBeInTheDocument();
        expect(
            await screen.findByText('Unable to load details. Please reload')
        ).toBeInTheDocument();
    });
    it('Shows an error message in footer, and MC pkg details card if getMcPunchList API call fails', async () => {
        causeApiError(ENDPOINTS.getMcPunchList, 'get');
        renderScope(SearchType.MC);
        expect(
            screen.queryByText('Unable to load scope. Please try again.')
        ).not.toBeInTheDocument();
        expect(
            await screen.findByText('Unable to load footer. Please reload')
        ).toBeInTheDocument();
        expect(
            await screen.findByText('Unable to load details. Please reload')
        ).toBeInTheDocument();
    });
    it('Renders a loading screen while awaiting API responses', async () => {
        server.use(
            rest.get(ENDPOINTS.getMcScope, (request, response, context) => {
                return response(
                    context.json(testScope),
                    context.status(200),
                    context.delay(20)
                );
            })
        );
        renderScope(SearchType.MC);
        expect(await screen.findByTestId('skeleton-row')).toBeInTheDocument();
        expect(await screen.findByText(testScope[0].tagNo)).toBeInTheDocument();
    });
    it('Renders the Scope component, footer, and MC pkg details card if API calls are successfull', async () => {
        renderScope(SearchType.MC);
        expect(await screen.findByText(testScope[0].tagNo)).toBeInTheDocument();
        expect(
            await screen.findByRole('button', {
                name: `Scope ${testScope.length}`,
            })
        ).toBeInTheDocument();
        expect(
            await screen.findByText(testMcPkgPreview[0].mcPkgNo)
        ).toBeInTheDocument();
    });
    it('Shows a placeholder message if scope is empty', async () => {
        server.use(
            rest.get(ENDPOINTS.getMcScope, (request, response, context) => {
                return response(context.json([]), context.status(200));
            })
        );
        renderScope(SearchType.MC);
        expect(
            await screen.findByText('The scope is empty.')
        ).toBeInTheDocument();
        expect(
            await screen.findByText(testMcPkgPreview[0].mcPkgNo)
        ).toBeInTheDocument();
    });
});

describe('<ScopePage> in-page routing', () => {
    it('Renders the PunchList component if the punch list button is clicked', async () => {
        // This test sometimes fails when using the jest extension, but doesn't when using yarn test
        // ^is most likely caused by the botttom expect being called too quickly (?) might be fixed once the test is completed
        renderScope(SearchType.MC);
        expect(
            await screen.findByText(testMcPkgPreview[0].mcPkgNo)
        ).toBeInTheDocument();
        expect(await screen.findByText(testScope[0].tagNo)).toBeInTheDocument();
        const punchListButton = await screen.findByRole('button', {
            name: `Punch list ${dummyPunchListResponse.length}`,
        });
        expect(punchListButton).toBeInTheDocument();
        userEvent.click(punchListButton);
        expect(
            await screen.findByText(testMcPkgPreview[0].mcPkgNo)
        ).toBeInTheDocument();
        // TODO: add an expect to test something from the punch list once the component is finished
        // ^ will both be a better test and remove the act error
        expect(screen.queryByText(testScope[0].tagNo)).not.toBeInTheDocument();
    });
    it.todo('Renders Scope compoent if the scope button is clicked');
});

describe('<ScopePage> punch list', () => {
    it.todo('Renders a list of punches');
    it.todo('Renders a loading screen while awaiting API response');
    it.todo('Shows an error message if X API call fails');
    it.todo('Shows a placeholder message if punch list is empty');
});
