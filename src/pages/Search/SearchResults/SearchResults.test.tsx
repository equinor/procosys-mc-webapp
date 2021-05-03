import { render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { SearchStatus } from '../useSearchPageFacade';
import { McPkgPreview, CompletionStatus } from '../../../services/apiTypes';
import SearchResults from './SearchResults';
import { testMcPkgPreview } from '../../../test/dummyData';
import { SearchType } from '../Search';

describe('<SearchResult/>', () => {
    it('Renders placeholder text before user starts typing an MC package number', () => {
        const { getByText } = render(
            <Router>
                <SearchResults
                    searchStatus={SearchStatus.INACTIVE}
                    searchResults={testMcPkgPreview}
                    searchType={SearchType.MC}
                />
            </Router>
        );
        expect(
            getByText(
                'Start typing your mechanical completion package number in the field above.'
            )
        ).toBeInTheDocument();
    });
    it('Renders placeholder text when no matching MC packages are found', () => {
        const { getByText } = render(
            <Router>
                <SearchResults
                    searchStatus={SearchStatus.SUCCESS}
                    searchResults={[]}
                    searchType={SearchType.MC}
                />
            </Router>
        );
        expect(
            getByText('No MC packages found for this search.')
        ).toBeInTheDocument();
    });
    it('Renders an error message if search could not be performed', () => {
        const { getByText } = render(
            <Router>
                <SearchResults
                    searchStatus={SearchStatus.ERROR}
                    searchResults={[]}
                    searchType={SearchType.MC}
                />
            </Router>
        );
        expect(
            getByText(
                'An error occurred, please refresh this page and try again.'
            )
        ).toBeInTheDocument();
    });
    it('Renders an MC package preview upon successful search containing search results', () => {
        const { getByText } = render(
            <Router>
                <SearchResults
                    searchStatus={SearchStatus.SUCCESS}
                    searchResults={testMcPkgPreview}
                    searchType={SearchType.MC}
                />
            </Router>
        );
        expect(getByText(testMcPkgPreview[0].description)).toBeInTheDocument();
    });
    it('Renders a loading screen while awaiting search results', () => {
        const { getByTestId } = render(
            <Router>
                <SearchResults
                    searchStatus={SearchStatus.SUCCESS}
                    searchResults={testMcPkgPreview}
                    searchType={SearchType.MC}
                />
            </Router>
        );
        expect(getByTestId('skeleton-row')).toBeInTheDocument();
    });
});
