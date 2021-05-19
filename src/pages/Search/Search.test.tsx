import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { withPlantContext } from '../../test/contexts';
import { testMcPkgPreview, testMcPkgSearch } from '../../test/dummyData';
import { causeApiError, ENDPOINTS, server } from '../../test/setupServer';
import { rest } from 'msw';
import Search, { SearchType } from './Search';

const search = async (
    searchType: SearchType,
    searchString: string
): Promise<void> => {
    const searchButton = await screen.findByRole('button', {
        name: searchType,
    });
    expect(searchButton).toBeInTheDocument();
    userEvent.click(searchButton);
    const searchField = await screen.findByRole('searchbox');
    expect(searchField).toBeInTheDocument();
    userEvent.type(searchField, searchString);
};

describe('<Search/> successes', () => {
    beforeEach(() => {
        render(
            withPlantContext({
                Component: <Search />,
            })
        );
    });
    it('Renders the search type buttons', () => {
        expect(screen.getByRole('button', { name: 'PO' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'MC' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'WO' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Tag' })).toBeInTheDocument();
    });
    it('Renders MC SearchArea if MC SearchTypeButton is clicked and removes SearchArea if the button is cliced again', async () => {
        // TODO: once saved search implemented: expect saved search
        userEvent.click(screen.getByRole('button', { name: 'MC' }));
        expect(
            await screen.findByPlaceholderText('For example: "1002-A001"')
        ).toBeInTheDocument();
        expect(
            await screen.findByText(
                'Start typing your mechanical completion package number in the field above.'
            )
        ).toBeInTheDocument();
        userEvent.click(screen.getByRole('button', { name: 'MC' }));
        expect(
            screen.queryByPlaceholderText('For example: "1002-A001"')
        ).not.toBeInTheDocument(); // TODO: once saved search implemented: expect saved search
    });
    it('Renders search results if user inputs value into search field in SearchArea', async () => {
        await search(SearchType.MC, testMcPkgPreview[0].mcPkgNo);
        const resultAmountMessage = await screen.findByText(
            'Displaying 1 out of 1 MC packages'
        );
        expect(resultAmountMessage).toBeInTheDocument();
        const description = await screen.findByText(
            testMcPkgPreview[0].description
        );
        expect(description).toBeInTheDocument();
    });
});

const renderSearch = (): void => {
    render(
        withPlantContext({
            Component: <Search />,
        })
    );
};

describe('<Search> negative tests', () => {
    it('Should show an error message if API call fails', async () => {
        renderSearch();
        causeApiError(ENDPOINTS.searchForMcPackage, 'get');
        await search(SearchType.MC, testMcPkgPreview[0].mcPkgNo);
        const errorMessage = await screen.findByText(
            'An error occurred, please refresh this page and try again.'
        );
        expect(errorMessage).toBeInTheDocument();
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
        const loading = await screen.findByTestId('skeleton-row');
        expect(loading).toBeInTheDocument();
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
        const infoMessage = await screen.findByText(
            'No MC packages found for this search.'
        );
        expect(infoMessage).toBeInTheDocument();
    });
});
