import React, { useState, useEffect, useContext, ReactElement } from 'react';
import PlantContext from '../contexts/PlantContext';
import McAppContext from '../contexts/McAppContext';
import { Button } from '@equinor/eds-core-react';
import useCommonHooks from '../utils/useCommonHooks';
import {
    AsyncStatus,
    ErrorPage,
    HomeButton,
    SkeletonLoadingPage,
} from '@equinor/procosys-webapp-components';

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
        const { auth } = useCommonHooks();
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
            return <SkeletonLoadingPage text="Checking permissions" />;
        }

        if (!featureFlags.mcAppIsEnabled) {
            return (
                <ErrorPage title="This app is currently disabled. See procosys.com for more info." />
            );
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
                    <HomeButton key={'home'} />,
                ]}
            />
        );
    };

export default withAccessControl;
