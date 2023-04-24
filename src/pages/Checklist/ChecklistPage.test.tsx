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
import { OfflineStatus } from '../../typings/enums';

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
            offlineState: OfflineStatus.ONLINE,
            setOfflineState: jest.fn(),
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
        renderChecklistPage('tag-info');
        expect(
            await screen.findByText('Unable to load details. Please reload')
        ).toBeInTheDocument();
        await expectFooter();
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
                'Error: Unable to get punch list. Please try again.'
            )
        );
    });
});
