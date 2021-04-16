import { render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { withPlantContext } from '../../test/contexts';
import Navbar from './Navbar';

jest.mock('react-spring', () => ({
    useSpring: jest.fn().mockImplementation(() => [{ mockProp: 1 }, jest.fn()]),
    animated: {
        div: (): JSX.Element => <div data-testid="ANIMATED-COMPONENT" />,
        aside: (): JSX.Element => <aside data-testid="ANIMATED-COMPONENT" />,
    },
}));

describe('<SideMenu/>', () => {
    // it('Renders hamburger icon when no props are passed to left content', () => {
    //     const { getAllByTitle } = render(
    //         <Router>
    //             <Navbar />
    //         </Router>
    //     );
    //     expect(getAllByTitle('Menu')).toBeInTheDocument();
    // });
    it('Renders a back icon when left content is set to "back"', () => {
        const { queryAllByTitle } = render(
            withPlantContext({
                Component: <Navbar leftContent={{ name: 'back' }} />,
            })
        );
        expect(queryAllByTitle('Back')).toBeDefined();
    });
    it('Renders a search icon when right content is set to search', () => {
        const { queryAllByTitle } = render(
            withPlantContext({
                Component: <Navbar rightContent={{ name: 'search' }} />,
            })
        );
        expect(queryAllByTitle('Search')).toBeDefined();
    });
    it('Renders whatever text is passed in as mid content prop', () => {
        const { getByText } = render(
            withPlantContext({
                Component: (
                    <Router>
                        <Navbar midContent="Test midcontent" />
                    </Router>
                ),
            })
        );
        expect(getByText('Test midcontent')).toBeDefined();
    });
    it('Renders new punch button when newPunch argument is passed', () => {
        const { getByText } = render(
            withPlantContext({
                Component: (
                    <Router>
                        <Navbar rightContent={{ name: 'newPunch' }} />
                    </Router>
                ),
            })
        );
        expect(getByText('New punch')).toBeDefined();
    });
});
