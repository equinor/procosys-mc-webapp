import React from 'react';
import styled from 'styled-components';
import { CommPkgFooterBase } from './NavigationFooter';

const NavigationFooterShellWrapper = styled(CommPkgFooterBase)`
    justify-content: center;
    align-items: centeR;
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
