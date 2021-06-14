import { withPlantContext } from '../../test/contexts';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ENDPOINTS, causeApiError } from '../../test/setupServer';
import { MemoryRouter, Route } from 'react-router-dom';
import PunchPage from './PunchPage';

const renderPunchPage = (): void => {
    render(
        withPlantContext({
            Component: (
                <MemoryRouter
                    initialEntries={[
                        `/plant-name/project-name/MC/33/checklist/10/punch-item/33
                        }`,
                    ]}
                >
                    <Route path="/:plant/:project/:searchType/:entityId/checklist/:checklistId/punch-item/:punchItemId">
                        <PunchPage />
                    </Route>
                </MemoryRouter>
            ),
        })
    );
};

const expectFooter = async (): Promise<void> => {
    expect(
        await screen.findByRole('button', {
            name: `Punch item`,
        })
    ).toBeInTheDocument();
};

describe('<PunchPage>', () => {
    it('Renders an error page if getPunchItem API call fails', async () => {
        causeApiError(ENDPOINTS.getPunchItem, 'get');
        renderPunchPage();
        expect(await screen.findByText('Unable to load punch item.'));
        await expectFooter();
    });
});
