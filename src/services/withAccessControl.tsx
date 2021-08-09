import React, { useState, useEffect, useContext, ReactElement } from 'react';
import ErrorPage from '../components/error/ErrorPage';
import SkeletonLoader from '../components/loading/SkeletonLoader';
import PlantContext from '../contexts/PlantContext';
import McAppContext, { AsyncStatus } from '../contexts/McAppContext';
import { Button } from '@equinor/eds-core-react';
import useCommonHooks from '../utils/useCommonHooks';

const withAccessControl =
    (
        WrappedComponent: () => ReactElement,
        requiredPermissions: string[] = []
    ) =>
    (props: JSX.IntrinsicAttributes): JSX.Element => {
        const { permissions } = useContext(PlantContext);
        const { featureFlags } = useContext(McAppContext);
        const [checkPermissionsStatus, setCheckPermissionsStatus] = useState(
            AsyncStatus.LOADING
        );
        const { history, auth } = useCommonHooks();
        useEffect(() => {
            if (permissions.length < 1) return;
            if (
                requiredPermissions.every(
                    (item) => permissions.indexOf(item) >= 0
                )
            ) {
                setCheckPermissionsStatus(AsyncStatus.SUCCESS);
            } else {
                setCheckPermissionsStatus(AsyncStatus.ERROR);
            }
        }, [permissions]);

        if (checkPermissionsStatus === AsyncStatus.LOADING) {
            return <SkeletonLoader text="Checking permissions" />;
        }

        if (!featureFlags.mcAppIsEnabled) {
            return <ErrorPage title="This app is disabled" />;
        }

        if (checkPermissionsStatus === AsyncStatus.SUCCESS) {
            return <WrappedComponent {...props} />;
        }

        return (
            <ErrorPage
                title="No access"
                description="You do not have permission to view this resource"
                actions={[
                    <Button key={'signOut'} onClick={auth.logout}>
                        Sign out
                    </Button>,
                    <Button key={'home'} onClick={(): void => history.push('')}>
                        Home
                    </Button>,
                ]}
            />
        );
    };

export default withAccessControl;
