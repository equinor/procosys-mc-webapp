import { withPlantContext } from '../../test/contexts';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { server, ENDPOINTS, causeApiError } from '../../test/setupServer';
import { SearchType } from '../Search/Search';
import { MemoryRouter, Route } from 'react-router-dom';
import ChecklistPage from './ChecklistPage';
import { dummyChecklistResponse } from '../../test/dummyData';

const renderChecklistPage = (contentType?: string): void => {
    render(
        withPlantContext({
            Component: (
                <MemoryRouter
                    initialEntries={[
                        `/plant-name/project-name/MC/33/checklist/10${
                            contentType ? `/${contentType}` : ''
                        }`,
                    ]}
                >
                    <Route path="/:plant/:project/:searchType/:itemId/checklist/:checklistId">
                        <ChecklistPage />
                    </Route>
                </MemoryRouter>
            ),
        })
    );
};

const expectDetails = async (): Promise<void> => {
    expect(
        await screen.findByText(dummyChecklistResponse.CheckList.McPkgNo)
    ).toBeInTheDocument();
};

const expectFooter = async (): Promise<void> => {
    expect(
        await screen.findByRole('button', {
            name: `Checklist`,
        })
    ).toBeInTheDocument();
};

describe('<ChecklistPage>', () => {
    it('Renders both the details card and the footer', async () => {
        renderChecklistPage();
        await expectDetails();
        await expectFooter();
        // TODO: add an expect for content (in this case checklist) to remove act warning
    });
    it('Shows an error message in the details card if the getChecklist API call fails', async () => {
        causeApiError(ENDPOINTS.getChecklist, 'get');
        renderChecklistPage();
        expect(
            await screen.findByText('Unable to load details. Please reload')
        ).toBeInTheDocument();
        await expectFooter();
        // TODO: add an expect for content (in this case checklist) to remove act warning
    });
    it('Shows an error message in the details card if the getChecklistPunchList API call fails', async () => {
        causeApiError(ENDPOINTS.getChecklistPunchList, 'get');
        renderChecklistPage();
        await expectDetails();
        expect(
            await screen.findByText('Unable to load footer. Please reload')
        ).toBeInTheDocument();
        // TODO: add an expect for content (in this case checklist) to remove act warning
    });
});
