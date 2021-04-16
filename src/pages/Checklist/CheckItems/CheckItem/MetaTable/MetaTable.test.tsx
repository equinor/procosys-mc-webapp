import { render, screen } from '@testing-library/react';
import MetaTable from './MetaTable';
import React from 'react';
import { dummyMetatableData } from '../../../../../test/dummyData';
import { BrowserRouter as Router } from 'react-router-dom';

const metaTableToRender = (
    <Router>
        <MetaTable
            labels={dummyMetatableData.labels}
            rows={dummyMetatableData.rows}
            isSigned={false}
            checkItemId={0}
            disabled={false}
        />
    </Router>
);

afterEach(() => {
    global.innerWidth = 300;
    global.window.dispatchEvent(new Event('resize'));
});

describe('<MetaTable/>', () => {
    it('Renders column labels when there are more than one label passed in', () => {
        render(metaTableToRender);
        expect(screen.getByText('dummy-column-label')).toBeInTheDocument();
    });
    it('Renders labels on the left of table when more than one column is passed in', () => {
        render(metaTableToRender);
        expect(screen.getByText('dummy-row-label')).toBeInTheDocument();
    });
    test.todo(
        'Renders a "Long table"-warning when table is wider then screen width'
    );
});
