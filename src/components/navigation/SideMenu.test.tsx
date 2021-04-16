import { render } from '@testing-library/react';
import React from 'react';
import { withPlantContext } from '../../test/contexts';
import SideMenu from './SideMenu';

const sideMenuToTest = withPlantContext({
    Component: (
        <SideMenu
            animation={{}}
            backdropAnimation={{}}
            setDrawerIsOpen={(): void => {
                return;
            }}
        />
    ),
});

describe('<SideMenu/>', () => {
    it('Renders welcome text', () => {
        const { getByText } = render(sideMenuToTest);
        expect(getByText('Welcome')).toBeInTheDocument();
    });
    it('Renders username', () => {
        const { getByText } = render(sideMenuToTest);
        expect(getByText('dummy-user')).toBeInTheDocument();
    });
});
