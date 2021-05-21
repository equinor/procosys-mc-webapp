import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import CompletionStatusIcon from '../../../components/icons/CompletionStatusIcon';
import EdsIcon from '../../../components/icons/EdsIcon';
import { ChecklistPreview } from '../../../services/apiTypes';
import { Caption, COLORS } from '../../../style/GlobalStyles';
import useCommonHooks from '../../../utils/useCommonHooks';
import {
    DetailsWrapper,
    StatusImageWrapper,
} from '../../../components/detailCards/McDetails';

const PreviewButton = styled(Link)`
    cursor: pointer;
    display: flex;
    padding: 12px 0;
    margin: 0;
    text-decoration: none;
    &:hover {
        opacity: 0.7;
    }
`;

const StatusTextWrapper = styled.div`
    display: flex;
    & > p {
        margin: 0;
        background-color: ${COLORS.lightGrey};
        font-size: 0.75rem;
    }
`;

const DetailsHeaderWrapper = styled.div`
    display: flex;
    align-items: baseline;
    & > p:first-child {
        flex: 2;
        color: ${COLORS.mossGreen};
        text-align: left;
    }
    & > p {
        margin: 0;
        flex: 1;
        text-align: right;
    }
`;

const DetailsBodyWrapper = styled.div`
    display: flex;
    margin: 0;
    & > div {
        margin-left: auto;
    }
    & p {
        margin: 0;
    }
`;

const AttachmentWrapper = styled.div`
    display: flex;
    align-items: baseline;
`;

type ScopeItemProps = {
    checklist: ChecklistPreview;
};

const ScopeItem = ({ checklist }: ScopeItemProps): JSX.Element => {
    const { url } = useCommonHooks();
    return (
        <PreviewButton to={`${url}/checklist/${checklist.id}`}>
            <StatusImageWrapper>
                <CompletionStatusIcon status={checklist.status} />
                <StatusTextWrapper>
                    {checklist.isSigned ? <Caption>S</Caption> : null}
                    {checklist.isVerified ? <Caption>V</Caption> : null}
                </StatusTextWrapper>
            </StatusImageWrapper>
            <DetailsWrapper>
                <DetailsHeaderWrapper>
                    <Caption>{checklist.tagNo}</Caption>
                    <Caption>{checklist.formularType}</Caption>
                    <Caption>{checklist.responsibleCode}</Caption>
                </DetailsHeaderWrapper>
                <DetailsBodyWrapper>
                    <Caption>{checklist.tagDescription}</Caption>
                    {checklist.attachmentCount > 0 ? (
                        <AttachmentWrapper>
                            <Caption>{checklist.attachmentCount}</Caption>
                            <EdsIcon
                                name={'attach_file'}
                                size={16}
                                color={COLORS.black}
                            />
                        </AttachmentWrapper>
                    ) : null}
                </DetailsBodyWrapper>
            </DetailsWrapper>
        </PreviewButton>
    );
};

export default ScopeItem;
