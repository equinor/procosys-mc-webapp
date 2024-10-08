import { render } from '@testing-library/react';
import React from 'react';
import { withMcAppContext } from '../../test/contexts';
import { testPlants } from '../../test/dummyData';
import { OfflineStatus } from '../../typings/enums';
import SelectPlant from './SelectPlant';
import { AsyncStatus } from '@equinor/procosys-webapp-components';

describe('<SelectPlant />', () => {
    it('Renders plant buttons successfully upon loading', () => {
        const { getByText } = render(
            withMcAppContext({
                Component: <SelectPlant />,
                asyncStatus: AsyncStatus.SUCCESS,
                offlineState: OfflineStatus.ONLINE,
                setOfflineState: jest.fn(),
            })
        );
        expect(getByText(testPlants[0].title)).toBeInTheDocument();
    });
    it('Renders placeholder if there are no plants available', () => {
        const { getByText } = render(
            withMcAppContext({
                Component: <SelectPlant />,
                asyncStatus: AsyncStatus.SUCCESS,
                plants: [],
                offlineState: OfflineStatus.ONLINE,
                setOfflineState: jest.fn(),
            })
        );
        expect(getByText('No plants to show')).toBeInTheDocument();
    });
});
