import { withPlantContext } from '../../test/contexts';
import ScopePage from './ScopePage';
import React from 'react';
import {
    act,
    findByText,
    render,
    screen,
    waitFor,
} from '@testing-library/react';
import { rest } from 'msw';
import { server, ENDPOINTS, causeApiError } from '../../test/setupServer';
import { SearchType } from '../Search/Search';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

const renderScopePage = (): void => {
    render(
        withPlantContext({
            Component: <ScopePage />,
        })
    );
};
const renderScope = (searchType: SearchType): void => {
    render(
        withPlantContext({
            Component: (
                <MemoryRouter
                    initialEntries={[`/plant/project/${searchType}/33`]}
                >
                    <Route path="/:plant/:project/:searchType/:itemId">
                        <ScopePage />
                    </Route>
                    <Route path="/:plant/:project/:searchType/:itemId/punch-list">
                        <ScopePage />
                    </Route>
                </MemoryRouter>
            ),
        })
    );
};

describe('<ScopePage>', () => {
    it('Renders', async () => {
        renderScope(SearchType.MC);
    });
});
