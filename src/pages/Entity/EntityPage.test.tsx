import { withPlantContext } from '../../test/contexts';
import EntityPage from './EntityPage';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { server, ENDPOINTS, causeApiError } from '../../test/setupServer';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {
    dummyPunchListResponse,
    testMcPkgPreview,
    testPoPreview,
    testScope,
    testWoPreview,
} from '../../test/dummyData';
import { OfflineStatus } from '../../typings/enums';
import { SearchType } from '@equinor/procosys-webapp-components';

const user = userEvent.setup();

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
            offlineState: OfflineStatus.ONLINE,
            setOfflineState: jest.fn(),
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
    it('Renders the Scope component, footer, and PO details card if API calls are successfull', async () => {
        renderEntityPage(SearchType.PO);
        expect(await screen.findByText(testScope[0].tagNo)).toBeInTheDocument();
        expect(
            await screen.findByRole('button', {
                name: `Scope ${testScope.length}`,
            })
        ).toBeInTheDocument();
        expect(
            await screen.findByText(testPoPreview[0].title)
        ).toBeInTheDocument();
    });
    it('Renders the Scope component, footer, and Tag details card if API calls are successfull', async () => {
        renderEntityPage(SearchType.Tag);
        expect(await screen.findByText(testScope[0].tagNo)).toBeInTheDocument();
        expect(
            await screen.findByRole('button', {
                name: `Scope ${testScope.length}`,
            })
        ).toBeInTheDocument();
        expect(await screen.findByText('3CPO')).toBeInTheDocument();
    });
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
        await user.click(punchListButton);
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
        await user.click(scopeButton);
        expect(
            await screen.findByText(testMcPkgPreview[0].mcPkgNo)
        ).toBeInTheDocument();
        expect(await screen.findByText(testScope[0].tagNo)).toBeInTheDocument();
    });
    it('Renders the WorkOrderInfo component if the WO info button is clicked', async () => {
        renderEntityPage(SearchType.WO);
        expect(
            await screen.findByText(testWoPreview[0].workOrderNo)
        ).toBeInTheDocument();
        expect(await screen.findByText(testScope[0].tagNo)).toBeInTheDocument();
        const workOrderButton = await screen.findByRole('button', {
            name: 'WO info',
        });
        expect(workOrderButton).toBeInTheDocument();
        await user.click(workOrderButton);
        expect(
            await screen.findByText(testWoPreview[0].workOrderNo)
        ).toBeInTheDocument();
        expect(await screen.findByText('Description')).toBeInTheDocument();
        expect(await screen.findByText('Attachments')).toBeInTheDocument();
        await waitFor(() =>
            expect(
                screen.queryByText(testScope[0].tagNo)
            ).not.toBeInTheDocument()
        );
    });
    it("Shouldn't show 'WO info' button if search type isn't WO", async () => {
        renderEntityPage(SearchType.MC);
        expect(
            await screen.findByText(testMcPkgPreview[0].mcPkgNo)
        ).toBeInTheDocument();
        await waitFor(() =>
            expect(
                screen.queryByRole('button', { name: 'WO info' })
            ).not.toBeInTheDocument()
        );
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

describe('<Filter> component', () => {
    it('Only shows the checklist previews that match the filter values', async () => {
        renderEntityPage(SearchType.MC);
        const firstChecklistPreview = await screen.findByText(
            testScope[0].tagNo
        );
        expect(firstChecklistPreview).toBeInTheDocument();
        const secondChecklistPreview = await screen.findByText(
            testScope[1].tagNo
        );
        expect(secondChecklistPreview).toBeInTheDocument();
        const filterButton = await screen.findByRole('button', {
            name: 'filter button',
        });
        expect(filterButton).toBeInTheDocument();
        await user.click(filterButton);
        const okStatusCheckbox = await screen.findByLabelText('OK');
        expect(okStatusCheckbox).toBeInTheDocument();
        await user.click(okStatusCheckbox);
        expect(firstChecklistPreview).toBeInTheDocument();
        expect(secondChecklistPreview).not.toBeInTheDocument();
    });
    it('Only shows the checklist previews that match the filter values', async () => {
        renderEntityPage(SearchType.MC, true);
        const firstPunchItemPreview = await screen.findByText(
            dummyPunchListResponse[0].description
        );
        expect(firstPunchItemPreview).toBeInTheDocument();
        const secondPuncItemPreview = await screen.findByText(
            dummyPunchListResponse[1].description
        );
        expect(secondPuncItemPreview).toBeInTheDocument();
        const filterButton = await screen.findByRole('button', {
            name: 'filter button',
        });
        expect(filterButton).toBeInTheDocument();
        await user.click(filterButton);
        const clearedSignatureRadioButton = await screen.findByLabelText(
            'Cleared not verified'
        );
        expect(clearedSignatureRadioButton).toBeInTheDocument();
        await user.click(clearedSignatureRadioButton);
        expect(firstPunchItemPreview).toBeInTheDocument();
        expect(secondPuncItemPreview).not.toBeInTheDocument();
    });
});
