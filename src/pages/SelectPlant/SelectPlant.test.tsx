import { render } from '@testing-library/react';
import React from 'react';
import { AsyncStatus } from '../../contexts/CommAppContext';
import { withCommAppContext } from '../../test/contexts';
import { testPlants } from '../../test/dummyData';
import SelectPlant from './SelectPlant';

describe('<SelectPlant />', () => {
    it('Renders plant buttons successfully upon loading', () => {
        const { getByText } = render(
            withCommAppContext({
                Component: <SelectPlant />,
                asyncStatus: AsyncStatus.SUCCESS,
            })
        );
        expect(getByText(testPlants[0].title)).toBeInTheDocument();
    });
    it('Renders placeholder if there are no plants available', () => {
        const { getByText } = render(
            withCommAppContext({
                Component: <SelectPlant />,
                asyncStatus: AsyncStatus.SUCCESS,
                plants: [],
            })
        );
        expect(getByText('No plants to show')).toBeInTheDocument();
    });
});
