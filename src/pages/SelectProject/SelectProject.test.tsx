import { render } from '@testing-library/react';
import React from 'react';
import { withPlantContext } from '../../test/contexts';
import { testProjects } from '../../test/dummyData';
import { OfflineStatus } from '../../typings/enums';
import SelectProject from '../SelectProject/SelectProject';
import { AsyncStatus } from '@equinor/procosys-webapp-components';

describe('<SelectProject />', () => {
    it('Renders project buttons successfully upon loading', () => {
        const { getByText } = render(
            withPlantContext({
                Component: <SelectProject />,
                fetchProjectsAndPermissionsStatus: AsyncStatus.SUCCESS,
                offlineState: OfflineStatus.ONLINE,
                setOfflineState: jest.fn(),
            })
        );
        expect(getByText(testProjects[0].title)).toBeInTheDocument();
    });
    // it('Renders loading page while fetching available projects', () => {
    //     const { getByText } = render(
    //         withPlantContext({
    //             Component: <SelectProject />,
    //             fetchProjectsAndPermissionsStatus: AsyncStatus.LOADING,
    //         })
    //     );
    //     expect(getByText(/Loading/)).toBeInTheDocument();
    // });
    // it('Renders no projects to show placeholder if there are no projects available', () => {
    //     const { getByText } = render(
    //         withPlantContext({
    //             Component: <SelectProject />,
    //             fetchProjectsAndPermissionsStatus: AsyncStatus.SUCCESS,
    //             availableProjects: [],
    //         })
    //     );
    //     expect(
    //         getByText(
    //             'There are no projects available. Try selecting a different plant.'
    //         )
    //     ).toBeInTheDocument();
    // });
    it('Displays error message when unable to fetch projects', () => {
        const { getByText } = render(
            withPlantContext({
                Component: <SelectProject />,
                fetchProjectsAndPermissionsStatus: AsyncStatus.ERROR,
                availableProjects: [],
                offlineState: OfflineStatus.ONLINE,
                setOfflineState: jest.fn(),
            })
        );
        expect(
            getByText('Unable to load projects. Please try again.')
        ).toBeInTheDocument();
    });
});
