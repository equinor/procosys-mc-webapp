import React from 'react';
import styled from 'styled-components';
import { OutstandingIpo } from '../services/apiTypes';
import { COLORS, Caption } from '../style/GlobalStyles';
import { TextIcon } from '@equinor/procosys-webapp-components';
import useCommonHooks from '../utils/useCommonHooks';

const IconWrapper = styled.div`
    padding-top: 3px;
    margin-right: 16px;
`;

const OutstandingIpoWrapper = styled.article<{ clickable: boolean }>`
    cursor: ${(props): string => (props.clickable ? 'pointer' : 'default')};
    display: flex;
    padding: 16px 0px;
    margin: 0;
    text-decoration: none;
    background-color: ${(props): string =>
        props.clickable ? COLORS.white : COLORS.fadedBlue};
    &:hover {
        opacity: ${(props): number => (props.clickable ? 0.7 : 1)};
    }
`;

const ContentWrapper = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    & > h6 {
        margin: 0;
        color: ${COLORS.mossGreen};
    }
    & > p {
        margin: 0;
    }
`;

type OutstandingIPOsProps = {
    ipo: OutstandingIpo;
    isDetailsCard?: boolean;
    clickable?: boolean;
};

const OutstandingIpoResult = ({
    ipo,
    clickable = true,
}: OutstandingIPOsProps): JSX.Element => {
    const { history, url } = useCommonHooks();

    return (
        <OutstandingIpoWrapper
            clickable={clickable}
            as={clickable ? 'a' : 'article'}
            role="link"
            onClick={(): void => {
                if (clickable) {
                    history.push(`${url}/IPO/${ipo.invitationId}`);
                }
            }}
        >
            <IconWrapper>
                <TextIcon color={COLORS.ipoIcon} text="IPO" />
            </IconWrapper>
            <ContentWrapper>
                <h6>{ipo.invitationId}</h6>
                <Caption>{ipo.description}</Caption>
            </ContentWrapper>
            <Caption>
                {ipo.organization == 'Contractor' && 'Ready for completing'}
                {ipo.organization == 'ConstructionCompany' &&
                    'Ready for acceptance'}
                {ipo.organization == 'Commissioning' && 'Ready for signing'}
            </Caption>
        </OutstandingIpoWrapper>
    );
};

export default OutstandingIpoResult;
