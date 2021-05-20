import React from 'react';
import {
    DetailsWrapper,
    StatusImageWrapper,
} from '../../../components/detailCards/McDetails';
import CompletionStatusIcon from '../../../components/icons/CompletionStatusIcon';
import EdsIcon from '../../../components/icons/EdsIcon';
import { PunchPreview } from '../../../services/apiTypes';
import { Caption, COLORS } from '../../../style/GlobalStyles';
import {
    AttachmentWrapper,
    DetailsBodyWrapper,
    DetailsHeaderWrapper,
    PreviewButton,
    StatusTextWrapper,
} from '../Scope/ScopeItem';

type PunchProps = {
    punch: PunchPreview;
};

const Punch = ({ punch }: PunchProps): JSX.Element => {
    // TODO: add link to previewButton
    return (
        <PreviewButton to={``}>
            <StatusImageWrapper>
                <CompletionStatusIcon status={punch.status} />
                <StatusTextWrapper>
                    {punch.cleared ? <Caption>C</Caption> : <></>}
                    {punch.verified ? <Caption>V</Caption> : <></>}
                </StatusTextWrapper>
            </StatusImageWrapper>
            <DetailsWrapper>
                <DetailsHeaderWrapper>
                    <Caption>{punch.id}</Caption>
                    {
                        // TODO: add caption with callOffNo
                    }
                </DetailsHeaderWrapper>
                <DetailsHeaderWrapper>
                    <Caption>{punch.tagNo}</Caption>
                    <Caption>{punch.formularType}</Caption>
                    <Caption>{punch.responsibleCode}</Caption>
                </DetailsHeaderWrapper>
                <DetailsBodyWrapper>
                    <Caption>{punch.tagDescription}</Caption>
                    {punch.attachmentCount > 0 ? (
                        <AttachmentWrapper>
                            <Caption>{punch.attachmentCount}</Caption>
                            <EdsIcon
                                name={'attach_file'}
                                size={16}
                                color={COLORS.black}
                            />
                        </AttachmentWrapper>
                    ) : (
                        <></>
                    )}
                </DetailsBodyWrapper>
            </DetailsWrapper>
        </PreviewButton>
    );
};

export default Punch;
