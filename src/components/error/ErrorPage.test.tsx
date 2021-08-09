import { render } from '@testing-library/react';
import React from 'react';
import ErrorPage from './ErrorPage';

describe('<ErrorPage />', () => {
    // TODO: fix this test to use screen stuff like the other tests
    it('Renders with description and error title passed in', () => {
        const { getByText } = render(
            <ErrorPage description="Test description" title="Test title" />
        );
        expect(getByText('Test title')).toBeInTheDocument();
        expect(getByText('Test description')).toBeInTheDocument();
    });
    // TODO: add some new tests?
});
