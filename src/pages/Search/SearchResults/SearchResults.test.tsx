import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { SearchStatus } from '../useSearchPageFacade';
import SearchResults from './SearchResults';
import { testMcPkgSearch } from '../../../test/dummyData';
import { SearchType } from '../Search';

describe('<SearchResult/>', () => {
    it('Renders a loading screen while awaiting search results', () => {
        render(
            <Router>
                <SearchResults
                    searchStatus={SearchStatus.LOADING}
                    searchResults={testMcPkgSearch}
                    searchType={SearchType.MC}
                />
            </Router>
        );
        expect(screen.getByTestId('skeleton-row')).toBeInTheDocument();
    });
    it('Renders placeholder text when no matching MC packages are found', () => {
        render(
            <Router>
                <SearchResults
                    searchStatus={SearchStatus.SUCCESS}
                    searchResults={{
                        maxAvailable: 0,
                        items: [],
                    }}
                    searchType={SearchType.MC}
                />
            </Router>
        );
        expect(
            screen.getByText('No MC packages found for this search.')
        ).toBeInTheDocument();
    });
});
