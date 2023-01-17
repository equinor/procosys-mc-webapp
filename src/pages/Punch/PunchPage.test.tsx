import { withPlantContext } from '../../test/contexts';
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ENDPOINTS, causeApiError, server, rest } from '../../test/setupServer';
import { MemoryRouter, Route } from 'react-router-dom';
import PunchPage from './PunchPage';
import {
    dummyPersonsSearch,
    dummyPunchCategories,
    dummyPunchItemCleared,
    dummyPunchItemUncleared,
    dummyPunchOrganizations,
    dummyPunchPriorities,
    dummyPunchSorts,
    dummyPunchTypes,
} from '../../test/dummyData';
import userEvent from '@testing-library/user-event';
import { OfflineStatus } from '../../typings/enums';

const renderPunchPage = (): void => {
    render(
        withPlantContext({
            Component: (
                <MemoryRouter
                    initialEntries={[
                        `/plant-name/project-name/MC/33/checklist/10/punch-item/33`,
                    ]}
                >
                    <Route path="/:plant/:project/:searchType/:entityId/checklist/:checklistId/punch-item/:punchItemId">
                        <PunchPage />
                    </Route>
                </MemoryRouter>
            ),
            offlineState: OfflineStatus.ONLINE,
            setOfflineState: jest.fn(),
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

const expectDetails = async (): Promise<void> => {
    expect(
        await screen.findByText(dummyPunchItemUncleared.TagNo)
    ).toBeInTheDocument();
};

describe('<PunchPage>', () => {
    it('Renders the tag info page if the tag info footer button is clicked', async () => {
        renderPunchPage();
        await expectDetails();
        expect(
            await screen.findByRole('button', {
                name: 'Clear',
            })
        ).toBeInTheDocument();
        const tagInfoButton = await screen.findByRole('button', {
            name: `Tag info`,
        });
        expect(tagInfoButton).toBeInTheDocument();
        userEvent.click(tagInfoButton);
        await expectDetails();
        expect(
            await screen.findByText('Nye pumper - TEST PROJECT')
        ).toBeInTheDocument();
        expect(tagInfoButton).toBeInTheDocument();
    });
    it('Renders the ClearPunch component when the "Unclear" button has been clicked', async () => {
        server.use(
            rest.get(ENDPOINTS.getPunchItem, (request, response, context) => {
                return response(
                    context.json(dummyPunchItemCleared),
                    context.status(200)
                );
            })
        );
        renderPunchPage();
        await expectDetails();
        await expectFooter();
        const unclearButton = await screen.findByRole('button', {
            name: 'Unclear',
        });
        expect(unclearButton).toBeInTheDocument();
        server.use(
            rest.get(ENDPOINTS.getPunchItem, (request, response, context) => {
                return response(
                    context.json(dummyPunchItemUncleared),
                    context.status(200)
                );
            })
        );
        userEvent.click(unclearButton);
        await expectDetails();
        await expectFooter();
        const clearButton = await screen.findByText('Clear');
        expect(clearButton).toBeInTheDocument();
    });
});
