import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { useState } from 'react';
import { withPlantContext } from '../../../test/contexts';
import {
    dummyPersonsSearch,
    dummyPunchCategories,
    dummyPunchItemCleared,
    dummyPunchItemUncleared,
    dummyPunchOrganizations,
    dummyPunchPriorities,
    dummyPunchSorts,
    dummyPunchTypes,
    testPunchItemUncleared,
} from '../../../test/dummyData';
import {
    causeApiError,
    ENDPOINTS,
    rest,
    server,
} from '../../../test/setupServer';
import ClearPunch from './ClearPunch';

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

describe('<ClearPunch/>', () => {
    it('Shows an error message if one of the options api calls fail', async () => {
        causeApiError(ENDPOINTS.getPunchOrganizations, 'get');
        render(
            withPlantContext({
                Component: (
                    <ClearPunch
                        punchItem={testPunchItemUncleared}
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                        setPunchItem={(punch): void => {}}
                    />
                ),
            })
        );
        expect(
            await screen.findByText(
                'Please check your connection, reload this page or try again later.'
            )
        ).toBeInTheDocument();
    });
});
