import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { withPlantContext } from '../../test/contexts';
import { testMcPkgPreview } from '../../test/dummyData';
import { causeApiError, ENDPOINTS } from '../../test/setupServer';
import Search, { SearchType } from './Search';

const search = (searchType: SearchType, searchString: string): void => {
    const searchButton = screen.getByRole('button', { name: searchType });
    expect(searchButton).toBeInTheDocument();
    userEvent.click(searchButton);
    const searchField = screen.getByRole('searchbox');
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
    it('Renders MC SearchArea if MC SearchTypeButton is clicked and removes SearchArea if the button is cliced again', () => {
        // TODO: once saved search implemented: expect saved search
        userEvent.click(screen.getByRole('button', { name: 'MC' }));
        expect(
            screen.getByPlaceholderText('For example: "1002-A001"')
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                'Start typing your mechanical completion package number in the field above.'
            )
        ).toBeInTheDocument();
        userEvent.click(screen.getByRole('button', { name: 'MC' }));
        expect(
            screen.queryByPlaceholderText('For example: "1002-A001"')
        ).not.toBeInTheDocument(); // TODO: once saved search implemented: expect saved search
    });
    it('Renders search results if user inputs value into search field in SearchArea', async () => {
        search(SearchType.MC, testMcPkgPreview[0].mcPkgNo);
        const resultAmountMessage = await screen.findByText(
            'Displaying 1 out of 1 MC packages'
        );
        expect(resultAmountMessage).toBeInTheDocument();
    });
    it('Should show an error message if API call fails', async () => {
        causeApiError(ENDPOINTS.searchForMcPackage, 'get');
        search(SearchType.MC, testMcPkgPreview[0].mcPkgNo);
        const errorMessage = await screen.findByText(
            'An error occurred, please refresh this page and try again.'
        );
        expect(errorMessage).toBeInTheDocument();
    });
});
