import { withPlantContext } from '../../test/contexts';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ENDPOINTS, causeApiError } from '../../test/setupServer';
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
describe('<ChecklistPage> in-page routing', () => {
    beforeEach(() => {
        renderChecklistPage('new-punch');
    });
    it.todo('Shows the Checklist if the "Checklist" button is clicked');
    it.todo('Shows the Tag info if the "Tag info" button is clicked');
    it.todo('Shows the punch list if the "Punch list" button is clicked');
    // TODO: do the test below in this PR
    it.todo(
        'Shows the NewPunch component if the "New punch" button is clicked'
    );
});

describe('<ChecklistPage> New Punch', () => {
    it('Shows an error message if getPunchCategories API call fails', async () => {
        // TODO: change api call below so that details doesn't fail too!
        causeApiError(ENDPOINTS.getChecklist, 'get');
        renderChecklistPage('new-punch');
        expect(
            await screen.findByText(
                'Unable to load new punch. Please check your connection, permissions, or refresh this page.'
            )
        );
        //await expectDetails();
        await expectFooter();
    });
    it('Should be possible to create a new punch', async () => {
        renderChecklistPage('new-punch');
        // TODO: finish
    });
});
