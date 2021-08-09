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

const expectSnackbar = async (): Promise<void> => {
    expect(
        await screen.findByText('Change successfully saved.')
    ).toBeInTheDocument();
};

const selectOption = async (
    selectFieldName: string,
    optionToBeSelected: string,
    valueToBeSelected: string,
    optionIndex = 0
): Promise<void> => {
    const selectField = await screen.findByLabelText(selectFieldName);
    expect(selectField).toBeInTheDocument();
    // Options in select fields are always visible, since both 'Raised by' and 'Clearing by' uses same options this has to be done:
    const options = await screen.findAllByText(optionToBeSelected);
    const option = options[optionIndex];
    userEvent.selectOptions(selectField, option);
    expect((option as HTMLOptionElement).selected).toBeTruthy();
    expect((selectField as HTMLSelectElement).value).toEqual(valueToBeSelected);
    await expectSnackbar();
};

describe('<PunchPage>', () => {
    it('Renders an error page if getPunchItem API call fails', async () => {
        causeApiError(ENDPOINTS.getPunchItem, 'get');
        renderPunchPage();
        expect(
            await screen.findByText('Unable to load details. Please reload')
        );
        expect(await screen.findByText('Unable to load punch item.'));
        await expectFooter();
    });
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
    it('Renders the VerifyPunch component when the "Clear" button has been clicked', async () => {
        renderPunchPage();
        await expectDetails();
        await expectFooter();
        const clearButton = await screen.findByRole('button', {
            name: 'Clear',
        });
        expect(clearButton).toBeInTheDocument();
        server.use(
            rest.get(ENDPOINTS.getPunchItem, (request, response, context) => {
                return response(
                    context.json(dummyPunchItemCleared),
                    context.status(200)
                );
            })
        );
        userEvent.click(clearButton);
        await expectDetails();
        await expectFooter();
        const unclearButton = await screen.findByRole('button', {
            name: 'Unclear',
        });
        expect(unclearButton).toBeInTheDocument();
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
        const clearButton = await screen.findByRole('button', {
            name: 'Clear',
        });
        expect(clearButton).toBeInTheDocument();
    });
    it('Updates the punch item when a form field is changed', async () => {
        jest.setTimeout(10000);
        renderPunchPage();
        expect(
            await screen.findByRole('button', {
                name: 'Clear',
            })
        ).toBeInTheDocument();
        // choosing punch category
        await selectOption(
            'Punch category',
            dummyPunchCategories[0].Description,
            dummyPunchPriorities[0].Id.toString()
        );
        // adding to description
        const descriptionBox = await screen.findByRole('textbox', {
            name: 'Description',
        });
        userEvent.type(descriptionBox, 'Dummy text');
        userEvent.tab();
        await expectSnackbar();
        await waitFor(() =>
            expect(descriptionBox.innerHTML).toEqual(
                dummyPunchItemUncleared.Description + 'Dummy text'
            )
        );
        // choosing raised by and clearing by
        await selectOption(
            'Raised by',
            dummyPunchOrganizations[0].Description,
            dummyPunchOrganizations[0].Id.toString()
        );
        await selectOption(
            'Clearing by',
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
        await expectSnackbar();
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
        await expectSnackbar();
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
        await expectSnackbar();
    });
});
