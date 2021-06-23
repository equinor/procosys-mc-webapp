import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../../style/GlobalStyles';

const EntityDetailsWrapper = styled.article<{ isDetailsCard?: boolean }>`
    cursor: ${(props): string => (props.isDetailsCard ? 'none' : 'pointer')};
    display: flex;
    border-top: 1px solid ${COLORS.lightGrey};
    padding: 16px 4%;
    margin: 0;
    text-decoration: none;
    background-color: ${(props): string =>
        props.isDetailsCard ? COLORS.fadedBlue : COLORS.white};
    &:hover {
        opacity: ${(props): number => (props.isDetailsCard ? 1 : 0.7)};
    }
`;

const IconWrapper = styled.div`
    padding-top: 3px;
    margin-right: 16px;
`;

const ContentWrapper = styled.div`
    flex-direction: column;
    flex: 1;
    & > p {
        margin: 0;
    }
`;

const HeaderWrapper = styled.div<{ isDetailsCard?: boolean }>`
    display: flex;
    align-items: baseline;
    & > h6 {
        margin: 0;
        flex: 1.4;
        color: ${(props): string =>
            props.isDetailsCard ? COLORS.black : COLORS.mossGreen};
    }
    & > p {
        margin: 0;
        flex: 1;
        text-align: right;
    }
`;

type EntityDetailsProps = {
    isDetailsCard?: boolean;
    icon: JSX.Element;
    headerText: string;
    description: string;
    details?: string[];
    onClick?: () => void;
};

const EntityDetails = ({
    isDetailsCard,
    icon,
    headerText,
    description,
    details,
    onClick,
}: EntityDetailsProps): JSX.Element => {
    return (
        <EntityDetailsWrapper
            isDetailsCard={isDetailsCard}
            onClick={onClick}
            role={isDetailsCard ? 'heading' : 'button'}
        >
            <IconWrapper>{icon}</IconWrapper>
            <ContentWrapper>
                <HeaderWrapper isDetailsCard={isDetailsCard}>
                    <h6>{headerText}</h6>
                    {details?.map((detail) => (
                        <p key={detail}>{detail}</p>
                    ))}
                </HeaderWrapper>
                <p>{description}</p>
            </ContentWrapper>
        </EntityDetailsWrapper>
    );
};

export default EntityDetails;
