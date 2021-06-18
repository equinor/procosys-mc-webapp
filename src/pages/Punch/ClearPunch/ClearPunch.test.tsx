import { render, screen } from '@testing-library/react';
import React from 'react';
import { withPlantContext } from '../../../test/contexts';
import { testPunchItemUncleared } from '../../../test/dummyData';
import { causeApiError, ENDPOINTS } from '../../../test/setupServer';
import ClearPunch from './ClearPunch';

describe('<ClearPunch/>', () => {
    it('Shows an error message if one of the options api calls fail', async () => {
        causeApiError(ENDPOINTS.getPunchOrganizations, 'get');
        render(
            withPlantContext({
                Component: (
                    <ClearPunch
                        punchItem={testPunchItemUncleared}
                        setPunchItem={jest.fn()}
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
