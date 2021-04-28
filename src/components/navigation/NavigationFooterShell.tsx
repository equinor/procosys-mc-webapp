import React from 'react';
import styled from 'styled-components';
import { NavigationFooterBase } from './NavigationFooter';

const NavigationFooterShellWrapper = styled(NavigationFooterBase)`
    justify-content: center;
    align-items: center;
    height: 75px;
`;

type NavigationFooterShellProps = {
    children: JSX.Element;
};

const NavigationFooterShell = ({
    children,
}: NavigationFooterShellProps): JSX.Element => {
    return (
        <NavigationFooterShellWrapper>{children}</NavigationFooterShellWrapper>
    );
};

export default NavigationFooterShell;
