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

const OutstandingIpoWrapper = styled.article`
    cursor: pointer;
    display: flex;
    padding: 16px 0px;
    margin: 0;
    text-decoration: none;
    &:hover {
        opacity: 0.7;
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

export enum SavedSearchType {
    CHECKLIST = 'checklist',
    PUNCH = 'punch',
}

type OutstandingIPOsProps = {
    ipo: OutstandingIpo;
};

const OutstandingIpoResult = ({ ipo }: OutstandingIPOsProps): JSX.Element => {
    const { history, url } = useCommonHooks();

    return (
        <OutstandingIpoWrapper
            role="link"
            onClick={(): void => history.push(`${url}/IPO/${ipo.invitationId}`)}
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
