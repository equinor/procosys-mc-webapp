import React from 'react';
import styled from 'styled-components';

export const NavigationFooterBase = styled.div`
    width: 100%;
    max-width: 768px;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
`;

const NavigationFooterWrapper = styled(NavigationFooterBase)`
    justify-content: space-evenly;
`;

type NavigationFooterProps = {
    children: JSX.Element | JSX.Element[];
};

const NavigationFooter = ({ children }: NavigationFooterProps): JSX.Element => {
    return <NavigationFooterWrapper>{children}</NavigationFooterWrapper>;
};

export default NavigationFooter;
