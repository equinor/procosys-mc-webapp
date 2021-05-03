import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { SearchType } from '../Search';
import SearchArea from './SearchArea';

describe('<SearchArea/>', () => {
    it('Renders the search field', () => {
        render(
            <Router>
                <SearchArea searchType={SearchType.MC} />
            </Router>
        );
        expect(screen.getByRole('search')).toBeInTheDocument();
    });
    it('Renders the MC version of SearchResults if the search type is MC', () => {
        render(
            <Router>
                <SearchArea searchType={SearchType.MC} />
            </Router>
        );
        expect(
            screen.getByText(
                'Start typing your mechanical completion package number in the field above.'
            )
        ).toBeInTheDocument();
    });
});
