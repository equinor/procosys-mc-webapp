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
import { causeApiError, ENDPOINTS, rest, server } from '../../test/setupServer';
import { CompletionStatus } from '../../services/apiTypes';
import userEvent from '@testing-library/user-event';

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

            offlineState: false,
            setOfflineState: jest.fn(() => {
                // Should be empty
            }),
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
    it('Renders more results if the "Load More" buttton is clicked & there are more results to get', async () => {
        renderSavedSearchPage(SavedSearchType.PUNCH);
        expect(
            await screen.findByText(testSavedSearch[0].name)
        ).toBeInTheDocument();
        expect(
            await screen.findByText(testPunchListItemSavedSearch[0].id)
        ).toBeInTheDocument();
        server.use(
            rest.get(
                ENDPOINTS.getPunchItemSavedSearch,
                (request, response, context) => {
                    return response(
                        context.json([
                            {
                                id: 263924,
                                status: CompletionStatus.PA,
                                description:
                                    'test punch list item saved search description',
                                tagNo: 'test-punch-item-saved-search-tagNo',
                                tagId: 1,
                                formularType: 'AAB',
                                responsibleCode: 'OK42',
                                isCleared: false,
                                isVerified: false,
                                statusControlledBySwcr: false,
                                attachmentCount: 2,
                            },
                        ]),
                        context.status(200)
                    );
                }
            )
        );
        const loadMoreButton = await screen.findByRole('button', {
            name: 'Load More',
        });
        expect(loadMoreButton).toBeInTheDocument();
        userEvent.click(loadMoreButton);
        expect(await screen.findByText(263924)).toBeInTheDocument();
    });
    it('Renders an error message if the API call fails when clicking the "Load More" button', async () => {
        renderSavedSearchPage(SavedSearchType.PUNCH);
        expect(
            await screen.findByText(testSavedSearch[0].name)
        ).toBeInTheDocument();
        expect(
            await screen.findByText(testPunchListItemSavedSearch[0].id)
        ).toBeInTheDocument();
        causeApiError(ENDPOINTS.getPunchItemSavedSearch, 'get');
        const loadMoreButton = await screen.findByRole('button', {
            name: 'Load More',
        });
        expect(loadMoreButton).toBeInTheDocument();
        userEvent.click(loadMoreButton);
        expect(
            await screen.findByText(
                'Could not load more results. Try again or reload the page.'
            )
        ).toBeInTheDocument();
    });
    it('Disables the "Load More" button if the API call returns an empty value', async () => {
        renderSavedSearchPage(SavedSearchType.PUNCH);
        expect(
            await screen.findByText(testSavedSearch[0].name)
        ).toBeInTheDocument();
        expect(
            await screen.findByText(testPunchListItemSavedSearch[0].id)
        ).toBeInTheDocument();
        server.use(
            rest.get(
                ENDPOINTS.getPunchItemSavedSearch,
                (request, response, context) => {
                    return response(context.json([]), context.status(200));
                }
            )
        );
        const loadMoreButton = await screen.findByRole('button', {
            name: 'Load More',
        });
        expect(loadMoreButton).toBeInTheDocument();
        userEvent.click(loadMoreButton);
        expect(
            await screen.findByRole('button', {
                name: 'Load More',
            })
        ).toBeDisabled();
    });
});
