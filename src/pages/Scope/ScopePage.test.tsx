import { withPlantContext } from '../../test/contexts';
import ScopePage from './ScopePage';
import React from 'react';
import { findByText, render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { server, ENDPOINTS, causeApiError } from '../../test/setupServer';

const renderScopePage = (): void => {
    render(
        withPlantContext({
            Component: <ScopePage />,
        })
    );
};

describe('<ScopePage>', () => {
    it('Renders', async () => {
        renderScopePage();
    });
});
