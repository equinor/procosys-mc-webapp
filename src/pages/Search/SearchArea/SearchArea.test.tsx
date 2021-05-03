import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { withPlantContext } from '../../../test/contexts';
import { testMcPkgPreview } from '../../../test/dummyData';
import { causeApiError, ENDPOINTS } from '../../../test/setupServer';
import { SearchType } from '../Search';
import SearchArea from './SearchArea';

const searchForMCPackage = (): void => {
    const searchField = screen.getByRole('searchbox');
    fireEvent.change(searchField, {
        target: { value: testMcPkgPreview[0].mcPkgNo },
    });
};

describe('<SearchArea/> search type MC', () => {
    beforeEach(() => {
        render(
            withPlantContext({
                Component: <SearchArea searchType={SearchType.MC} />,
            })
        );
    });
    it('Renders the search field', () => {
        expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });
    it('Renders the MC version of SearchResults if the search type is MC', () => {
        expect(
            screen.getByText(
                'Start typing your mechanical completion package number in the field above.'
            )
        ).toBeInTheDocument();
    });
    it('Should show an error message if API call fails', async () => {
        causeApiError(ENDPOINTS.searchForMcPackage, 'get');
        searchForMCPackage();
        const errorMessage = await screen.findByText(
            'An error occurred, please refresh this page and try again.'
        );
        expect(errorMessage).toBeInTheDocument();
    });
    it('Should show the search results if API call is successfull', async () => {
        searchForMCPackage();
        const resultAmountMessage = await screen.findByText(
            'Displaying 1 out of 1 MC packages'
        );
        expect(resultAmountMessage).toBeInTheDocument();
    });
});
