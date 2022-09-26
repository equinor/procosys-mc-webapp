import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { withPlantContext } from '../../test/contexts';
import {
    testMcPkgPreview,
    testMcPkgSearch,
    testPoPreview,
    testSavedSearch,
    testTagPreview,
    testWoPreview,
} from '../../test/dummyData';
import { causeApiError, ENDPOINTS, server } from '../../test/setupServer';
import { rest } from 'msw';
import SearchPage from './SearchPage';
import { SearchType } from '../../typings/enums';
import { MemoryRouter, Route } from 'react-router-dom';

const search = async (
    searchType: SearchType,
    searchString: string
): Promise<void> => {
    const searchButton = await screen.findByRole('button', {
        name: searchType,
    });
    expect(searchButton).toBeInTheDocument();
    userEvent.click(searchButton);
    const searchField = await screen.findByRole('search', {
        name: 'Searchbar',
    });
    expect(searchField).toBeInTheDocument();
    userEvent.type(searchField, searchString);
};

describe('<Search/> successes', () => {
    beforeEach(() => {
        render(
            withPlantContext({
                Component: (
                    <MemoryRouter initialEntries={[`/plant-name/project-name`]}>
                        <Route path="/:plant/:project">
                            <SearchPage />
                        </Route>
                    </MemoryRouter>
                ),
                offlineState: false,
                setOfflineState: jest.fn(
                    (offlineState: boolean): Promise<void> => {
                        return Promise.resolve();
                    }
                ),
            })
        );
    });
    it('Renders MC search results if user inputs value into the MC search field', async () => {
        await search(SearchType.MC, testMcPkgPreview[0].mcPkgNo);
        expect(
            await screen.findByText('Displaying 1 out of 1 MC packages')
        ).toBeInTheDocument();
        expect(
            await screen.findByText(testMcPkgPreview[0].description)
        ).toBeInTheDocument();
    });
    it('Renders WO search results if user inputs value into the WO search field', async () => {
        await search(SearchType.WO, testWoPreview[0].workOrderNo);
        expect(
            await screen.findByText('Displaying 1 out of 1 Work Orders')
        ).toBeInTheDocument();
        expect(
            await screen.findByText(testWoPreview[0].title)
        ).toBeInTheDocument();
    });
    it('Renders Tag search results if user inputs value into the Tag search field', async () => {
        await search(SearchType.Tag, testTagPreview[0].tagNo);
        expect(
            await screen.findByText('Displaying 1 out of 1 Tags')
        ).toBeInTheDocument();
        expect(
            await screen.findByText(testTagPreview[0].description)
        ).toBeInTheDocument();
    });

    it('Renders PO search results if user inputs value into the PO number search field', async () => {
        await search(SearchType.PO, testPoPreview[0].title);
        expect(
            await screen.findByText('Displaying 1 out of 1 Purchase Orders')
        ).toBeInTheDocument();
        expect(
            await screen.findByText(testPoPreview[0].description)
        ).toBeInTheDocument();
    });

    it('Renders PO search results if user inputs value into the call off number search field', async () => {
        const searchButton = await screen.findByRole('button', {
            name: SearchType.PO,
        });
        expect(searchButton).toBeInTheDocument();
        userEvent.click(searchButton);
        const searchField = await screen.findByRole('search', {
            name: 'CallOffSearchbar',
        });
        expect(searchField).toBeInTheDocument();
        userEvent.type(searchField, 'CO1');
        expect(
            await screen.findByText('Displaying 1 out of 1 Purchase Orders')
        ).toBeInTheDocument();
        expect(
            await screen.findByText(testPoPreview[0].description)
        ).toBeInTheDocument();
    });
    it('Removes a saved search if the delete button is clicked', async () => {
        expect(
            await screen.findByText(testSavedSearch[0].name)
        ).toBeInTheDocument();
        const deleteButton = await screen.findByRole('button', {
            name: 'Delete saved search',
        });
        expect(deleteButton).toBeInTheDocument();
        userEvent.click(deleteButton);
        const deleteButton2 = await screen.findByRole('button', {
            name: 'Delete',
        });
        expect(deleteButton2).toBeInTheDocument;
        userEvent.click(deleteButton2);
        await waitFor(() =>
            expect(
                screen.queryByText(testSavedSearch[0].name)
            ).not.toBeInTheDocument()
        );
    });
});

const renderSearch = (): void => {
    render(
        withPlantContext({
            Component: (
                <MemoryRouter initialEntries={[`/plant-name/project-name`]}>
                    <Route path="/:plant/:project">
                        <SearchPage />
                    </Route>
                </MemoryRouter>
            ),
            offlineState: false,
            setOfflineState: jest.fn((offlineState: boolean): Promise<void> => {
                return Promise.resolve();
            }),
        })
    );
};

describe('<Search> negative tests', () => {
    it('Should show an error message if search API call fails', async () => {
        renderSearch();
        causeApiError(ENDPOINTS.searchForMcPackage, 'get');
        await search(SearchType.MC, testMcPkgPreview[0].mcPkgNo);
        expect(
            await screen.findByText(
                'An error occurred, please refresh this page and try again.'
            )
        ).toBeInTheDocument();
    });
    it('Renders a loading screen while awaiting search results', async () => {
        server.use(
            rest.get(
                ENDPOINTS.searchForMcPackage,
                (request, response, context) => {
                    return response(
                        context.json(testMcPkgSearch),
                        context.status(200),
                        context.delay(40)
                    );
                }
            )
        );
        renderSearch();
        await search(SearchType.MC, testMcPkgPreview[0].mcPkgNo);
        expect(await screen.findByTestId('skeleton-row')).toBeInTheDocument();
        expect(
            await screen.findByText(testMcPkgPreview[0].description)
        ).toBeInTheDocument();
    });
    it('Renders placeholder text when no matching MC packages are found', async () => {
        server.use(
            rest.get(
                ENDPOINTS.searchForMcPackage,
                (request, response, context) => {
                    return response(
                        context.json({
                            maxAvailable: 0,
                            items: [],
                        }),
                        context.status(200)
                    );
                }
            )
        );
        renderSearch();
        await search(SearchType.MC, '44');
        expect(
            await screen.findByText('No MC packages found for this search.')
        ).toBeInTheDocument();
    });
});
