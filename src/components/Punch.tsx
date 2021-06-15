import React from 'react';
import { DetailsWrapper, StatusImageWrapper } from './detailCards/McDetails';
import CompletionStatusIcon from './icons/CompletionStatusIcon';
import EdsIcon from './icons/EdsIcon';
import { PunchPreview } from '../services/apiTypes';
import { Caption, COLORS } from '../style/GlobalStyles';
import {
    AttachmentWrapper,
    DetailsBodyWrapper,
    DetailsHeaderWrapper,
    PreviewButton,
    StatusTextWrapper,
} from '../pages/Entity/Scope/ScopeItem';
import { Typography } from '@equinor/eds-core-react';
import useCommonHooks from '../utils/useCommonHooks';
import removeSubdirectories from '../utils/removeSubdirectories';

type PunchProps = {
    punch: PunchPreview;
};

const Punch = ({ punch }: PunchProps): JSX.Element => {
    const { url } = useCommonHooks();
    return (
        <PreviewButton
            to={`${removeSubdirectories(url, 1)}/punch-item/${punch.id}`}
        >
            <StatusImageWrapper>
                <CompletionStatusIcon status={punch.status} />
                <StatusTextWrapper>
                    {punch.cleared ? <Caption>C</Caption> : <></>}
                    {punch.verified ? <Caption>V</Caption> : <></>}
                </StatusTextWrapper>
            </StatusImageWrapper>
            <DetailsWrapper>
                <DetailsHeaderWrapper clickable>
                    <Caption>{punch.id}</Caption>
                    {
                        // TODO: add caption with callOffNo for PO punch
                    }
                </DetailsHeaderWrapper>
                <DetailsHeaderWrapper clickable>
                    <Caption>{punch.tagNo}</Caption>
                    <Caption>{punch.formularType}</Caption>
                    <Caption>{punch.responsibleCode}</Caption>
                </DetailsHeaderWrapper>
                <DetailsBodyWrapper>
                    <Typography variant="caption" lines={3}>
                        {punch.description}
                    </Typography>
                    {punch.attachmentCount > 0 ? (
                        <AttachmentWrapper>
                            <Caption>{punch.attachmentCount}</Caption>
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

export default Punch;
