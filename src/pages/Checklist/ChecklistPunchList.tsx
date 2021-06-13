import { Typography } from '@equinor/eds-core-react';
import React from 'react';
import styled from 'styled-components';
import AsyncPage from '../../components/AsyncPage';
import CompletionStatusIcon from '../../components/icons/CompletionStatusIcon';
import EdsIcon from '../../components/icons/EdsIcon';
import Punch from '../../components/Punch';
import { AsyncStatus } from '../../contexts/McAppContext';
import { PunchPreview } from '../../services/apiTypes';
import { COLORS } from '../../style/GlobalStyles';
import { TagInfoWrapper } from './TagInfo';

const ChecklistPunchListWrapper = styled(TagInfoWrapper)`
    padding: 0 4%;
`;

const PunchPreviewWrapper = styled.div`
    width: 100%;
    display: flex;
    margin-top: 16px;
    cursor: pointer;
`;

const IconsWrapper = styled.div`
    width: 24px;
    height: 48px;
    position: relative;
    margin-right: 12px;
`;
const AttachmentCount = styled.p`
    position: absolute;
    top: 17px;
    right: 0px;
    font-size: 11px;
    font-weight: 500;
    text-align: right;
    background-color: ${COLORS.lightGrey};
    padding: 0 3px;
    border-radius: 5px;
`;

const TextWrapper = styled.div`
    & > h6 {
        margin: 0;
        color: ${COLORS.mossGreen};
    }
    & > p {
        margin: 0;
    }
`;

type ChecklistPunchListProps = {
    punchList?: PunchPreview[];
    fetchPunchListStatus: AsyncStatus;
};

const ChecklistPunchList = ({
    punchList,
    fetchPunchListStatus,
}: ChecklistPunchListProps): JSX.Element => {
    const punchButton = (punch: PunchPreview): JSX.Element => {
        return (
            <PunchPreviewWrapper
                key={punch.id}
                role={'button'}
                aria-label={punch.id.toString()}
            >
                <IconsWrapper>
                    <CompletionStatusIcon status={punch.status} />
                    {punch.attachmentCount > 0 ? (
                        <>
                            <EdsIcon name={'attachment'} />
                            <AttachmentCount>
                                {punch.attachmentCount}
                            </AttachmentCount>
                        </>
                    ) : null}
                </IconsWrapper>
                <TextWrapper>
                    <h6>{punch.id}</h6>
                    <Typography lines={3}>{punch.description}</Typography>
                </TextWrapper>
            </PunchPreviewWrapper>
        );
    };

    return (
        <AsyncPage
            fetchStatus={fetchPunchListStatus}
            errorMessage={'Unable to get punch list. Please try again.'}
            emptyContentMessage={'The punch list is empty.'}
        >
            <ChecklistPunchListWrapper>
                {punchList?.map((punch) => punchButton(punch))}
            </ChecklistPunchListWrapper>
        </AsyncPage>
    );
};

export default ChecklistPunchList;
