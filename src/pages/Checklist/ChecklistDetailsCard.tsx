import React from 'react';
import styled from 'styled-components';
import {
    DetailsWrapper,
    StatusImageWrapper,
} from '../../components/detailCards/McDetails';
import CompletionStatusIcon from '../../components/icons/CompletionStatusIcon';
import EdsIcon from '../../components/icons/EdsIcon';
import { ChecklistDetails } from '../../services/apiTypes';
import { Caption, COLORS } from '../../style/GlobalStyles';
import {
    AttachmentWrapper,
    DetailsHeaderWrapper,
    StatusTextWrapper,
} from '../Entity/Scope/ScopeItem';

const ChecklistDetailsCardWrapper = styled.article`
    display: flex;
    padding: 16px 4%;
    margin: 0;
    background-color: ${COLORS.fadedBlue};
`;

const DetailsBodyWrapper = styled.div`
    display: flex;
    margin: 0;
    & > div:not(:first-child) {
        margin-left: auto;
    }
    & p {
        margin: 0;
    }
`;

type ChecklistDetailsCardProps = {
    details: ChecklistDetails;
};

const ChecklistDetailsCard = ({
    details,
}: ChecklistDetailsCardProps): JSX.Element => {
    return (
        <ChecklistDetailsCardWrapper>
            <StatusImageWrapper>
                <CompletionStatusIcon status={details.status} />
                <StatusTextWrapper>
                    {details.signedAt ? <Caption>S</Caption> : null}
                    {details.verifiedAt ? <Caption>V</Caption> : null}
                </StatusTextWrapper>
            </StatusImageWrapper>
            <DetailsWrapper>
                <DetailsHeaderWrapper>
                    <Caption>{details.mcPkgNo}</Caption>
                    <Caption>{details.formularType}</Caption>
                    <Caption>{details.responsibleCode}</Caption>
                </DetailsHeaderWrapper>
                <DetailsBodyWrapper>
                    <div>
                        <Caption>{details.tagNo}</Caption>
                        <Caption>{details.tagDescription}</Caption>
                    </div>
                    {details.attachmentCount > 0 ? (
                        <AttachmentWrapper>
                            <Caption>{details.attachmentCount}</Caption>
                            <EdsIcon
                                name={'attach_file'}
                                size={16}
                                color={COLORS.black}
                            />
                        </AttachmentWrapper>
                    ) : null}
                </DetailsBodyWrapper>
            </DetailsWrapper>
        </ChecklistDetailsCardWrapper>
    );
};

export default ChecklistDetailsCard;
