import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { SearchStatus } from '../useSearchPageFacade';
import { McPkgPreview, CompletionStatus } from '../../../services/apiTypes';
import SearchResults from './SearchResults';
import { testMcPkgSearch } from '../../../test/dummyData';
import { SearchType } from '../Search';

describe('<SearchResult/>', () => {
    it('Renders placeholder text before user starts typing an MC package number', () => {
        render(
            <Router>
                <SearchResults
                    searchStatus={SearchStatus.INACTIVE}
                    searchResults={testMcPkgSearch}
                    searchType={SearchType.MC}
                />
            </Router>
        );
        expect(
            screen.getByText(
                'Start typing your mechanical completion package number in the field above.'
            )
        ).toBeInTheDocument();
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
    it('Renders an error message if search could not be performed', () => {
        render(
            <Router>
                <SearchResults
                    searchStatus={SearchStatus.ERROR}
                    searchResults={{
                        maxAvailable: 0,
                        items: [],
                    }}
                    searchType={SearchType.MC}
                />
            </Router>
        );
        expect(
            screen.getByText(
                'An error occurred, please refresh this page and try again.'
            )
        ).toBeInTheDocument();
    });
    it('Renders an MC package preview and search result count upon successful search containing search results', () => {
        render(
            <Router>
                <SearchResults
                    searchStatus={SearchStatus.SUCCESS}
                    searchResults={testMcPkgSearch}
                    searchType={SearchType.MC}
                />
            </Router>
        );
        expect(
            screen.getByText(testMcPkgSearch.items[0].description)
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                `Displaying ${testMcPkgSearch.items.length} out of ${testMcPkgSearch.maxAvailable} MC packages`
            )
        ).toBeInTheDocument();
    });
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
});
