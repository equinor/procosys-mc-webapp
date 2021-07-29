import { withPlantContext } from '../../test/contexts';
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ENDPOINTS, causeApiError, server, rest } from '../../test/setupServer';
import { MemoryRouter, Route } from 'react-router-dom';
import ChecklistPage from './ChecklistPage';
import {
    dummyChecklistResponse,
    dummyPersonsSearch,
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
                    <Route path="/:plant/:project/:searchType/:entityId/checklist/:checklistId">
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
    expect(await screen.findByText('Main tag info')).toBeInTheDocument();
};

const expectNewPunchPage = async (): Promise<void> => {
    expect(await screen.findByText('Due Date')).toBeInTheDocument();
    expect(await screen.findByText('Optional fields')).toBeInTheDocument();
    expect(await screen.findByText('Attachments')).toBeInTheDocument();
};

const expectPunchListPage = async (): Promise<void> => {
    expect(
        await screen.findByText('Test punch description')
    ).toBeInTheDocument();
    expect(
        await screen.findByRole('button', { name: 'filter button' })
    ).toBeInTheDocument();
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
        renderChecklistPage('punch-list/new-punch');
        expect(
            await screen.findByText('Unable to load details. Please reload')
        ).toBeInTheDocument();
        await expectFooter();
        await expectNewPunchPage();
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
    it('Shows the Tag info if the "Tag info" button is clicked', async () => {
        renderChecklistPage('tag-info');
        await expectTagInfoPage();
    });
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
        const backButton = await screen.findByRole('img', {
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
    valueToBeSelected: string,
    optionIndex = 0
): Promise<void> => {
    const selectField = await screen.findByRole('combobox', {
        name: selectFieldName,
    });
    expect(selectField).toBeInTheDocument();
    // Options in select fields are always visible, since both 'Raised by' and 'Clearing by' uses same options this has to be done:
    const options = await screen.findAllByText(optionToBeSelected);
    const option = options[optionIndex];
    userEvent.selectOptions(selectField, option);
    expect((option as HTMLOptionElement).selected).toBeTruthy();
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
    it('Is possible to create a new punch', async () => {
        renderChecklistPage('punch-list/new-punch');
        await expectNewPunchPage();
        // choosing punch category
        await selectOption(
            'Punch category *',
            dummyPunchCategories[0].Description,
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
            dummyPunchOrganizations[0].Id.toString()
        );
        await selectOption(
            'Clearing by *',
            dummyPunchOrganizations[0].Description,
            dummyPunchOrganizations[0].Id.toString(),
            1
        );
        // Choosing a person
        const personInput = await screen.findByRole('textbox', {
            name: 'Action by person',
        });
        expect(personInput).toBeInTheDocument();
        userEvent.click(personInput);
        const personSearch = screen.getByRole('searchbox');
        expect(personSearch).toBeInTheDocument();
        userEvent.type(personSearch, 'name');
        const person = await screen.findByText(
            `${dummyPersonsSearch[0].FirstName} ${dummyPersonsSearch[0].LastName}`
        );
        expect(person).toBeInTheDocument();
        userEvent.click(person);
        expect(personSearch).not.toBeInTheDocument();
        const personInputAfter = await screen.findByRole('textbox', {
            name: 'Action by person',
        });
        await waitFor(() =>
            expect((personInputAfter as HTMLInputElement).value).toEqual(
                `${dummyPersonsSearch[0].FirstName} ${dummyPersonsSearch[0].LastName}`
            )
        );
        // Choosing due date
        const dateInput = await screen.findByRole('datepicker');
        fireEvent.change(dateInput, { target: { value: '2021-05-05' } });
        expect((dateInput as HTMLInputElement).value).toEqual('2021-05-05');
        // Choosing type, Sorting and Priority
        await selectOption(
            'Type',
            `${dummyPunchTypes[0].Code}. ${dummyPunchTypes[0].Description}`,
            dummyPunchTypes[0].Id.toString()
        );
        await selectOption(
            'Sorting',
            `${dummyPunchSorts[0].Code}. ${dummyPunchSorts[0].Description}`,
            dummyPunchSorts[0].Id.toString()
        );
        await selectOption(
            'Priority',
            `${dummyPunchPriorities[0].Code}. ${dummyPunchPriorities[0].Description}`,
            dummyPunchPriorities[0].Id.toString()
        );
        // adding an estimate
        const estimateBox = await screen.findByRole('spinbutton', {
            name: 'Estimate',
        });
        userEvent.type(estimateBox, '5');
        expect((estimateBox as HTMLInputElement).value).toEqual('5');
        // submitting form
        const createPunchButton = await screen.findByRole('button', {
            name: 'Create punch',
        });
        expect(createPunchButton).toBeInTheDocument();
        userEvent.click(createPunchButton);
        await expectDetails();
        await expectPunchListPage();
        await expectFooter();
        await waitFor(() =>
            expect(
                screen.queryByText('Action by person')
            ).not.toBeInTheDocument()
        );
    });
});

describe('<ChecklistPage> Tag info', () => {
    it('Shows an error message if getTag API call fails', async () => {
        causeApiError(ENDPOINTS.getTag, 'get');
        renderChecklistPage('tag-info');
        expect(
            await screen.findByText(
                'Unable to load tag info. Please try again.'
            )
        );
    });
    it('Shows main tag info when panel is open, and hide it when its closed', async () => {
        renderChecklistPage('tag-info');
        const mainInfoPanel = await screen.findByText('Main tag info');
        expect(screen.getByText('Tag info')).toBeInTheDocument();
        userEvent.click(mainInfoPanel);
        expect(screen.getByText('Tag number')).not.toBeVisible();
    });
    it('Shows additional fields with value and unit when panel is open, and hide it when its closd', async () => {
        renderChecklistPage('tag-info');
        const detailsPanel = await screen.findByText('Details');
        expect(screen.getByText('dummy-field-value ms')).toBeInTheDocument();
        userEvent.click(detailsPanel);
        expect(screen.getByText('dummy-field-value ms')).not.toBeVisible();
    });
});

describe('<ChecklistPage> Punch list', () => {
    it('Shows error message if unable to get punch preview items from API', async () => {
        causeApiError(ENDPOINTS.getChecklistPunchList, 'get');
        renderChecklistPage('punch-list');
        expect(
            await screen.findByText(
                'Unable to get punch list. Please try again.'
            )
        );
    });
});
