import { withPlantContext } from '../../test/contexts';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ENDPOINTS, causeApiError, server, rest } from '../../test/setupServer';
import { MemoryRouter, Route } from 'react-router-dom';
import ChecklistPage from './ChecklistPage';
import {
    dummyChecklistResponse,
    dummyPunchCategories,
    dummyPunchOrganizations,
    dummyPunchPriorities,
    dummyPunchSorts,
    dummyPunchTypes,
} from '../../test/dummyData';
import userEvent from '@testing-library/user-event';

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

const expectTagInfoPage = async (): Promise<void> => {
    // TODO: change the expect once the finished tag info page is routed to in ChecklistPage
    expect(await screen.findByText('tag info')).toBeInTheDocument();
};

const expectNewPunchPage = async (): Promise<void> => {
    expect(await screen.findByText('Punch category *')).toBeInTheDocument();
    expect(await screen.findByText('Optional fields')).toBeInTheDocument();
    expect(await screen.findByText('Attachments')).toBeInTheDocument();
};

const expectPunchListPage = async (): Promise<void> => {
    // TODO: change the expect once the finished punch list page is routed to in ChecklistPage
    expect(await screen.findByText('punch list')).toBeInTheDocument();
};

describe('<ChecklistPage>', () => {
    it('Renders both the details card and the footer', async () => {
        renderChecklistPage('tag-info');
        await expectDetails();
        await expectFooter();
        await expectTagInfoPage();
    });
    it('Shows an error message in the details card if the getChecklist API call fails', async () => {
        causeApiError(ENDPOINTS.getChecklist, 'get');
        renderChecklistPage('tag-info');
        expect(
            await screen.findByText('Unable to load details. Please reload')
        ).toBeInTheDocument();
        await expectFooter();
        await expectTagInfoPage();
    });
    it('Shows an error message in the details card if the getChecklistPunchList API call fails', async () => {
        causeApiError(ENDPOINTS.getChecklistPunchList, 'get');
        renderChecklistPage('tag-info');
        await expectDetails();
        expect(
            await screen.findByText('Unable to load footer. Please reload')
        ).toBeInTheDocument();
        await expectTagInfoPage();
    });
});

describe('<ChecklistPage> in-page routing', () => {
    it.todo('Shows the Tag info if the "Tag info" button is clicked');
    it.todo('Shows the punch list if the "Punch list" button is clicked');
    it('Shows the NewPunch component if the "New punch" button is clicked', async () => {
        renderChecklistPage('punch-list');
        await expectDetails();
        await expectPunchListPage();
        await expectFooter();
        const newPunchButton = await screen.findByRole('button', {
            name: 'New punch',
        });
        expect(newPunchButton).toBeInTheDocument();
        userEvent.click(newPunchButton);
        await expectDetails();
        await expectNewPunchPage();
        await expectFooter();
    });
    it('Shows the punch list if the back button is clicked when on the new punch page', async () => {
        renderChecklistPage('punch-list/new-punch');
        await expectDetails();
        await expectNewPunchPage();
        await expectFooter();
        const backButton = await screen.findByRole('button', {
            name: 'Back',
        });
        expect(backButton).toBeInTheDocument();
        userEvent.click(backButton);
        await expectDetails();
        await expectPunchListPage();
        await expectFooter();
    });
});

const selectOption = async (
    selectFieldName: string,
    optionToBeSelected: string,
    optionToNotBeSelected: string,
    valueToBeSelected: string,
    optionIndex = 0
): Promise<void> => {
    const selectField = await screen.findByRole('combobox', {
        name: selectFieldName,
    });
    expect(selectField).toBeInTheDocument();
    // Options in select fields are always visible, since both 'Raised by' and 'Clearing by' uses same options this has to be done:
    const firstOptions = await screen.findAllByText(optionToBeSelected);
    const secondOptions = await screen.findAllByText(optionToNotBeSelected);
    const firstOption = firstOptions[optionIndex];
    const secondOption = secondOptions[optionIndex];
    userEvent.selectOptions(selectField, firstOption);
    expect((firstOption as HTMLOptionElement).selected).toBeTruthy();
    expect((secondOption as HTMLOptionElement).selected).toBeFalsy();
    expect((selectField as HTMLSelectElement).value).toEqual(valueToBeSelected);
};

describe('<ChecklistPage> New Punch', () => {
    it('Shows an error message if getPunchCategories API call fails', async () => {
        causeApiError(ENDPOINTS.getPunchCategories, 'get');
        renderChecklistPage('punch-list/new-punch');
        expect(
            await screen.findByText(
                'Unable to load new punch. Please check your connection, permissions, or refresh this page.'
            )
        );
        await expectDetails();
        await expectFooter();
    });
    it('Shows a loading message while awaiting API response', async () => {
        server.use(
            rest.get(
                ENDPOINTS.getPunchCategories,
                (request, response, context) => {
                    return response(
                        context.json(dummyPunchCategories),
                        context.status(200),
                        context.delay(100)
                    );
                }
            )
        );
        renderChecklistPage('punch-list/new-punch');
        expect(
            await screen.findByText('Loading new punch.')
        ).toBeInTheDocument();
        await expectDetails();
        await expectFooter();
        await expectNewPunchPage();
    });
    it("Is not possible to create a new punch if the required fields in the new punch form haven't been filled", async () => {
        renderChecklistPage('punch-list/new-punch');
        await expectDetails();
        await expectFooter();
        await expectNewPunchPage();
        const createPunchButton = await screen.findByRole('button', {
            name: 'Create punch',
        });
        expect(createPunchButton).toBeInTheDocument();
        userEvent.click(createPunchButton);
        // TODO: expect post /put?? not to have been called??
        // TODO: why does the line below fail??
        //await expectNewPunchPage();
    });
    it('Is possible to create a new punch', async () => {
        renderChecklistPage('punch-list/new-punch');
        await expectNewPunchPage();
        // choosing punch category
        await selectOption(
            'Punch category *',
            dummyPunchCategories[0].Description,
            dummyPunchCategories[1].Description,
            dummyPunchPriorities[0].Id.toString()
        );
        // adding description
        const descriptionBox = await screen.findByRole('textbox', {
            name: 'Description *',
        });
        userEvent.type(descriptionBox, 'Dummy text');
        userEvent.tab();
        expect(descriptionBox.innerHTML).toEqual('Dummy text');
        // choosing raised by and clearing by
        await selectOption(
            'Raised by *',
            dummyPunchOrganizations[0].Description,
            dummyPunchOrganizations[1].Description,
            dummyPunchOrganizations[0].Id.toString()
        );
        await selectOption(
            'Clearing by *',
            dummyPunchOrganizations[0].Description,
            dummyPunchOrganizations[1].Description,
            dummyPunchOrganizations[0].Id.toString(),
            1
        );
        // TODO: choose a person
        // TODO: chose date
        // Choosing type, Sorting and Priority
        await selectOption(
            'Type',
            `${dummyPunchTypes[0].Code}. ${dummyPunchTypes[0].Description}`,
            `${dummyPunchTypes[1].Code}. ${dummyPunchTypes[1].Description}`,
            dummyPunchTypes[0].Id.toString()
        );
        await selectOption(
            'Sorting',
            `${dummyPunchSorts[0].Code}. ${dummyPunchSorts[0].Description}`,
            `${dummyPunchSorts[1].Code}. ${dummyPunchSorts[1].Description}`,
            dummyPunchSorts[0].Id.toString()
        );
        await selectOption(
            'Priority',
            `${dummyPunchPriorities[0].Code}. ${dummyPunchPriorities[0].Description}`,
            `${dummyPunchPriorities[1].Code}. ${dummyPunchPriorities[1].Description}`,
            dummyPunchPriorities[0].Id.toString()
        );
        // adding an estimate
        const estimateBox = await screen.findByRole('spinbutton', {
            name: 'Estimate',
        });
        userEvent.type(estimateBox, '5');
        // submitting form
        expect((estimateBox as HTMLInputElement).value).toEqual('5');
        const createPunchButton = await screen.findByRole('button', {
            name: 'Create punch',
        });
        expect(createPunchButton).toBeInTheDocument();
        userEvent.click(createPunchButton);
        // TODO: punch list on screen
        // TODO: new punch not on screen
        // TODO: new punch created with all info inputed
    });
});
