import { render, within } from '@testing-library/react';
import React from 'react';
import NavigationFooter from './NavigationFooter';
import { BrowserRouter as Router } from 'react-router-dom';
import { CompletionStatus } from '../../services/apiTypes';

describe('<NavigationFooter>', () => {
    it('Renders navigation buttons for scope, task and punches', () => {
        const { getByText } = render(
            <Router>
                <NavigationFooter
                    numberOfChecklists={5}
                    numberOfPunches={10}
                    numberOfTasks={15}
                    status={CompletionStatus.PA}
                />
            </Router>
        );
        expect(getByText('Scope')).toBeInTheDocument();
        expect(getByText('Tasks')).toBeInTheDocument();
        expect(getByText('Punch list')).toBeInTheDocument();
    });
    it('Renders the correct number of list items on the buttons', () => {
        const { getByTestId } = render(
            <Router>
                <NavigationFooter
                    numberOfChecklists={5}
                    numberOfPunches={10}
                    numberOfTasks={15}
                    status={CompletionStatus.PB}
                />
            </Router>
        );
        expect(
            within(getByTestId('scope-button')).getByText('5')
        ).toBeInTheDocument();
    });
});
