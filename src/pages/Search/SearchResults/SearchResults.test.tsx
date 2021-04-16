import { render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { SearchStatus } from '../useSearchPageFacade';
import { CommPkgPreview, CompletionStatus } from '../../../services/apiTypes';
import SearchPage from './SearchResults';
import { testCommPkgPreview } from '../../../test/dummyData';

describe('<SearchResult/>', () => {
    it('Renders placeholder text before user starts typing', () => {
        const { getByText } = render(
            <Router>
                <SearchPage
                    searchStatus={SearchStatus.INACTIVE}
                    commPackages={testCommPkgPreview}
                />
            </Router>
        );
        expect(
            getByText(
                'Start typing your Commissioning Package number in the field above.'
            )
        ).toBeInTheDocument();
    });
    it('Renders placeholder text when no matching comm pkgs are found', () => {
        const { getByText } = render(
            <Router>
                <SearchPage
                    searchStatus={SearchStatus.SUCCESS}
                    commPackages={[]}
                />
            </Router>
        );
        expect(
            getByText('No packages found for this search.')
        ).toBeInTheDocument();
    });
    it('Renders an error message if search could not be performed', () => {
        const { getByText } = render(
            <Router>
                <SearchPage
                    searchStatus={SearchStatus.ERROR}
                    commPackages={[]}
                />
            </Router>
        );
        expect(
            getByText(
                'An error occurred, please refresh this page and try again.'
            )
        ).toBeInTheDocument();
    });
    it('Renders a comm package preview upon successful search containing search results', () => {
        const { getByText } = render(
            <Router>
                <SearchPage
                    searchStatus={SearchStatus.SUCCESS}
                    commPackages={testCommPkgPreview}
                />
            </Router>
        );
        expect(
            getByText(testCommPkgPreview[0].description)
        ).toBeInTheDocument();
    });
    it('Renders a loading screen while awaiting search results', () => {
        const { getByTestId } = render(
            <Router>
                <SearchPage
                    searchStatus={SearchStatus.LOADING}
                    commPackages={testCommPkgPreview}
                />
            </Router>
        );
        expect(getByTestId('skeleton-row')).toBeInTheDocument();
    });
});
