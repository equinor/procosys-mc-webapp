import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { withPlantContext } from '../../test/contexts';
import { MemoryRouter, Route } from 'react-router-dom';
import SavedSearchPage from './SavedSearchPage';
import { SavedSearchType } from '../Search/SavedSearches/SavedSearchResult';
import {
    testChecklistSavedSearch,
    testPunchListItemSavedSearch,
    testSavedSearch,
} from '../../test/dummyData';
import { causeApiError, ENDPOINTS } from '../../test/setupServer';

const renderSavedSearchPage = (savedSearchType: string): void => {
    render(
        withPlantContext({
            Component: (
                <MemoryRouter
                    initialEntries={[
                        `/plant-name/project-name/saved-search/${savedSearchType}/${testSavedSearch[0].id}`,
                    ]}
                >
                    <Route path="/:plant/:project/saved-search/:savedSearchType/:savedSearchId">
                        <SavedSearchPage />
                    </Route>
                </MemoryRouter>
            ),
        })
    );
};

describe('<SavedSearchPage>', () => {
    it('Renders the checklist saved search page if the saved search type is checklist', async () => {
        renderSavedSearchPage(SavedSearchType.CHECKLIST);
        expect(
            await screen.findByText(testSavedSearch[0].name)
        ).toBeInTheDocument();
        expect(
            await screen.findByText(testChecklistSavedSearch[0].tagNo)
        ).toBeInTheDocument();
    });
    it('Renders the punch list item saved search page if the saved search type is punch', async () => {
        renderSavedSearchPage(SavedSearchType.PUNCH);
        expect(
            await screen.findByText(testSavedSearch[0].name)
        ).toBeInTheDocument();
        expect(
            await screen.findByText(testPunchListItemSavedSearch[0].id)
        ).toBeInTheDocument();
    });
    it('Shows an error message if the getSavedSearchResults API call fails', async () => {
        causeApiError(ENDPOINTS.getChecklistSavedSearch, 'get');
        renderSavedSearchPage(SavedSearchType.CHECKLIST);
        await waitFor(() =>
            expect(
                screen.queryByText(testChecklistSavedSearch[0].tagNo)
            ).not.toBeInTheDocument()
        );
        expect(
            await screen.findByText(
                'Unable to load the search results. Please try again.'
            )
        ).toBeInTheDocument();
    });
});
