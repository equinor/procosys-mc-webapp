import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { withPlantContext } from '../../test/contexts';
import Search from './Search';

describe('<Search/>', () => {
    beforeEach(() => {
        render(
            withPlantContext({
                Component: <Search />,
            })
        );
    });
    it('Renders the search type buttons', () => {
        expect(screen.getByText('PO')).toBeInTheDocument();
        expect(screen.getByText('MC')).toBeInTheDocument();
        expect(screen.getByText('WO')).toBeInTheDocument();
        expect(screen.getByText('Tag')).toBeInTheDocument();
    });
    it('Renders the SearchArea component with search type MC if the MC button is clicked', () => {
        fireEvent.click(screen.getByText('MC'));
        expect(screen.getByPlaceholderText('For example: "1002-A001"'));
    });
});
