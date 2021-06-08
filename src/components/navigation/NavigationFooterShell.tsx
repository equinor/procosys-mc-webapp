import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../../style/GlobalStyles';
import { NavigationFooterBase } from './NavigationFooter';

const NavigationFooterShellWrapper = styled(NavigationFooterBase)`
    justify-content: center;
    align-items: center;
    background-color: ${COLORS.white};
    height: 66px;
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
