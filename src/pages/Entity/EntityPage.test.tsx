import { withPlantContext } from '../../test/contexts';
import EntityPage from './EntityPage';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { server, ENDPOINTS, causeApiError } from '../../test/setupServer';
import { SearchType } from '../Search/Search';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {
    dummyPunchListResponse,
    testMcPkgPreview,
    testScope,
    testWoPreview,
} from '../../test/dummyData';

const renderEntityPage = (
    searchType: SearchType,
    punchList?: boolean
): void => {
    render(
        withPlantContext({
            Component: (
                <MemoryRouter
                    initialEntries={[
                        `/plant/project/${searchType}/33${
                            punchList ? '/punch-list' : ''
                        }`,
                    ]}
                >
                    <Route path="/:plant/:project/:searchType/:entityId">
                        <EntityPage />
                    </Route>
                </MemoryRouter>
            ),
        })
    );
};

describe('<EntityPage> general and Scope component', () => {
    it('Shows an error message in Scope component, footer card if getMcScope API call fails', async () => {
        causeApiError(ENDPOINTS.getMcScope, 'get');
        renderEntityPage(SearchType.MC);
        expect(
            await screen.findByText('Unable to load scope. Please try again.')
        ).toBeInTheDocument();
        expect(
            await screen.findByText('Unable to load footer. Please reload')
        ).toBeInTheDocument();
        expect(
            screen.queryByText('Unable to load details. Please reload')
        ).not.toBeInTheDocument();
    });
    it('Shows an error message in MC pkg details card if getMcPkgDetails API call fails', async () => {
        causeApiError(ENDPOINTS.getMcPkgDetails, 'get');
        renderEntityPage(SearchType.MC);
        expect(
            await screen.findByText('Unable to load details. Please reload')
        ).toBeInTheDocument();
        expect(
            screen.queryByText('Unable to load scope. Please try again.')
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText('Unable to load footer. Please reload')
        ).not.toBeInTheDocument();
    });
    it('Shows an error message in footer if getMcPunchList API call fails', async () => {
        causeApiError(ENDPOINTS.getMcPunchList, 'get');
        renderEntityPage(SearchType.MC);
        expect(
            screen.queryByText('Unable to load scope. Please try again.')
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText('Unable to load details. Please reload')
        ).not.toBeInTheDocument();
        expect(
            await screen.findByText('Unable to load footer. Please reload')
        ).toBeInTheDocument();
    });
    it('Renders a loading screen while awaiting API responses', async () => {
        server.use(
            rest.get(ENDPOINTS.getMcScope, (request, response, context) => {
                return response(
                    context.json(testScope),
                    context.status(200),
                    context.delay(80)
                );
            })
        );
        renderEntityPage(SearchType.MC);
        expect(await screen.findByTestId('skeleton-row')).toBeInTheDocument();
        expect(await screen.findByText(testScope[0].tagNo)).toBeInTheDocument();
    });
    it('Renders the Scope component, footer, and MC pkg details card if API calls are successfull', async () => {
        renderEntityPage(SearchType.MC);
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
    it('Renders the Scope component, footer, and WO details card if API calls are successfull', async () => {
        renderEntityPage(SearchType.WO);
        expect(await screen.findByText(testScope[0].tagNo)).toBeInTheDocument();
        expect(
            await screen.findByRole('button', {
                name: `Scope ${testScope.length}`,
            })
        ).toBeInTheDocument();
        expect(
            await screen.findByText(testWoPreview[0].workOrderNo)
        ).toBeInTheDocument();
    });
    it.todo(
        'Renders the Scope component, footer, and PO details card if API calls are successfull'
    );
    it.todo(
        'Renders the Scope component, footer, and Tag details card if API calls are successfull'
    );
    it('Shows a placeholder message if scope is empty', async () => {
        server.use(
            rest.get(ENDPOINTS.getMcScope, (request, response, context) => {
                return response(context.json([]), context.status(200));
            })
        );
        renderEntityPage(SearchType.MC);
        expect(
            await screen.findByText('The scope is empty.')
        ).toBeInTheDocument();
        expect(
            await screen.findByText(testMcPkgPreview[0].mcPkgNo)
        ).toBeInTheDocument();
    });
});

describe('<EntityPage> in-page routing', () => {
    it('Renders the PunchList component if the punch list button is clicked', async () => {
        renderEntityPage(SearchType.MC);
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
        expect(
            await screen.findByText(dummyPunchListResponse[0].description)
        ).toBeInTheDocument();
        await waitFor(() =>
            expect(
                screen.queryByText(testScope[0].tagNo)
            ).not.toBeInTheDocument()
        );
    });
    it('Renders Scope compoent if the scope button is clicked', async () => {
        renderEntityPage(SearchType.MC, true);
        expect(
            await screen.findByText(testMcPkgPreview[0].mcPkgNo)
        ).toBeInTheDocument();
        expect(
            await screen.findByText(dummyPunchListResponse[0].description)
        ).toBeInTheDocument();
        const scopeButton = await screen.findByRole('button', {
            name: `Scope ${testScope.length}`,
        });
        expect(scopeButton).toBeInTheDocument();
        userEvent.click(scopeButton);
        expect(
            await screen.findByText(testMcPkgPreview[0].mcPkgNo)
        ).toBeInTheDocument();
        expect(await screen.findByText(testScope[0].tagNo)).toBeInTheDocument();
    });
});

describe('<EntityPage> punch list', () => {
    it('Renders a list of punches', async () => {
        renderEntityPage(SearchType.MC, true);
        expect(
            await screen.findByText(testMcPkgPreview[0].mcPkgNo)
        ).toBeInTheDocument();
        expect(
            await screen.findByRole('button', {
                name: `Scope ${testScope.length}`,
            })
        ).toBeInTheDocument();
        expect(
            await screen.findByText(dummyPunchListResponse[0].description)
        ).toBeInTheDocument();
    });
    it('Renders a loading screen while awaiting API response', async () => {
        server.use(
            rest.get(ENDPOINTS.getMcPunchList, (request, response, context) => {
                return response(
                    context.json(dummyPunchListResponse),
                    context.status(200),
                    context.delay(100)
                );
            })
        );
        renderEntityPage(SearchType.MC, true);
        expect(await screen.findByTestId('skeleton-row')).toBeInTheDocument();
        expect(
            await screen.findByText(dummyPunchListResponse[0].tagNo)
        ).toBeInTheDocument();
    });
    it('Shows an error message in footer and punch list if getPunchList API call fails', async () => {
        causeApiError(ENDPOINTS.getMcPunchList, 'get');
        renderEntityPage(SearchType.MC, true);
        expect(
            screen.queryByText('Unable to load details. Please reload')
        ).not.toBeInTheDocument();
        expect(
            await screen.findByText(
                'Error: Unable to get punch list. Please try again.'
            )
        ).toBeInTheDocument();
        expect(
            await screen.findByText('Unable to load footer. Please reload')
        ).toBeInTheDocument();
    });
    it('Shows a placeholder message if punch list is empty', async () => {
        server.use(
            rest.get(ENDPOINTS.getMcPunchList, (request, response, context) => {
                return response(context.json([]), context.status(200));
            })
        );
        renderEntityPage(SearchType.MC, true);
        expect(
            await screen.findByText('The punch list is empty.')
        ).toBeInTheDocument();
        expect(
            await screen.findByText(testMcPkgPreview[0].mcPkgNo)
        ).toBeInTheDocument();
    });
});
