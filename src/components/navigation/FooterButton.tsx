import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../../style/GlobalStyles';

const FooterButtonWrapper = styled.button<{ active: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    border: none;
    flex: 1;
    cursor: pointer;
    height: 75px;
    padding: 20px 0 10px 0;
    background-color: ${(props): string =>
        props.active ? COLORS.fadedBlue : COLORS.white};
    position: relative;
    & img {
        width: 24px;
        height: 24px;
        object-fit: contain;
    }
    & p {
        margin: 0;
        margin-bottom: ${(props): string => (props.active ? '3px' : 'initial')};
    }
    &:focus,
    &:hover,
    &:active {
        background-color: initial;
        outline: none;
    }
`;

const ItemCount = styled.span`
    position: absolute;
    top: 10px;
    left: calc(50% + 10px);
    background-color: #f0f0f0;
    border-radius: 15px;
    min-width: 16px;
    padding: 4px 5px 2px 5px;
    margin: 0;
    & p {
        text-align: center;
        font-size: 12px;
        color: ${COLORS.black};
        border: none;
    }
`;

const ButtonText = styled.div`
    position: relative;
`;
type FooterButtonProps = {
    active: boolean;
    goTo: () => void;
    numberOfItems?: number;
    icon: JSX.Element;
    label: string;
};

const FooterButton = ({
    active,
    goTo,
    numberOfItems,
    icon,
    label,
}: FooterButtonProps): JSX.Element => {
    return (
        <FooterButtonWrapper active={active} onClick={goTo}>
            {icon}
            <p>{label}</p>
            {numberOfItems && (
                <ItemCount>
                    <p>{numberOfItems}</p>
                </ItemCount>
            )}
        </FooterButtonWrapper>
    );
};

export default FooterButton;
