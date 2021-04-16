import { render, screen } from '@testing-library/react';
import React from 'react';
import { withPlantContext } from '../../test/contexts';
import { testProjects } from '../../test/dummyData';
import { causeApiError, ENDPOINTS } from '../../test/setupServer';
import Bookmarks from './Bookmarks';
import { StorageKey } from './useBookmarks';

const renderBookmarks = (): void => {
    window.localStorage.clear();
    window.localStorage.setItem(
        `${StorageKey.BOOKMARK}: ${testProjects[1].id}`,
        JSON.stringify(['123'])
    );
    render(
        withPlantContext({
            Component: <Bookmarks />,
        })
    );
};

describe('<Bookmarks/>', () => {
    it('Renders the bookmarks page', async () => {
        renderBookmarks();
        expect(screen.getByText('Find comm. pkg')).toBeInTheDocument();
    });
    it('Renders bookmarks saved to localstorage', async () => {
        renderBookmarks();
        await expect(
            await screen.findByText('dummy-commPkg-description')
        ).toBeInTheDocument();
    });
    it('Renders error message if unable to load bookmarked commPkgs', async () => {
        causeApiError(ENDPOINTS.getCommPkgDetails, 'get');
        renderBookmarks();
        await expect(
            await screen.findByText(
                'Unable to load comm package details. Try reloading.'
            )
        ).toBeInTheDocument();
    });
});
