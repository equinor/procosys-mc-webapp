import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { withPlantContext } from '../../test/contexts';
import Search from './Search';

describe('<Search/>', () => {
    it('Renders the search type buttons', () => {
        render(
            withPlantContext({
                Component: <Search />,
            })
        );
        expect(screen.getByText('PO')).toBeInTheDocument();
        expect(screen.getByText('MC')).toBeInTheDocument();
        expect(screen.getByText('WO')).toBeInTheDocument();
        expect(screen.getByText('Tag')).toBeInTheDocument();
    });
    it('Renders the SearchArea component with search type MC if the MC button is clicked', () => {
        render(
            withPlantContext({
                Component: <Search />,
            })
        );
        fireEvent.click(screen.getByText('MC'));
        expect(screen.getByPlaceholderText('For example: "1002-A001"'));
    });
});
