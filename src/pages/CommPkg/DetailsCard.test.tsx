import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CompletionStatus } from '../../services/apiTypes';
import { withPlantContext } from '../../test/contexts';
import DetailsCard from './DetailsCard';

describe('<DetailsCard />', () => {
    it('Renders comm package description, package number and MC status', async () => {
        render(
            withPlantContext({ Component: <DetailsCard commPkgId={'123'} /> })
        );
        expect(
            await screen.findByText('dummy-commPkg-description')
        ).toBeInTheDocument();
    });
    test.todo('Renders loading');
    test.todo('Renders error');
});
