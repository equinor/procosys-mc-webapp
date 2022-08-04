import React, { useState } from 'react';
import styled from 'styled-components';
import { Caption, COLORS } from '../../style/GlobalStyles';
import { McPkgPreview } from '../../services/apiTypes';
import useCommonHooks from '../../utils/useCommonHooks';
import { McPackageStatusIcon } from '../icons/McPackageStatusIcon';
import { Button } from '@equinor/eds-core-react';
import EdsIcon from '../icons/EdsIcon';
import { AsyncStatus } from '../../contexts/McAppContext';

const McDetailsWrapper = styled.article<{ clickable: boolean }>`
    cursor: ${(props): string => (props.clickable ? 'pointer' : 'default')};
    display: flex;
    border-top: 1px solid ${COLORS.lightGrey};
    padding: 16px 4%;
    margin: 0;
    text-decoration: none;
    background-color: ${(props): string =>
        props.clickable ? COLORS.white : COLORS.fadedBlue};
    &:hover {
        opacity: ${(props): number => (props.clickable ? 0.7 : 1)};
    }
`;

export const StatusImageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding-right: 12px;
    align-self: center;
    width: 24px;
`;

const StatusTextWrapper = styled.div`
    display: flex;
    & > p {
        margin: 0;
    }
`;

const HandoverStatus = styled.p<{ accepted: boolean }>`
    font-weight: bolder;
    font-size: 0.75rem;
    color: ${(props): string =>
        props.accepted ? COLORS.black : COLORS.darkGrey};
    width: 24px;
`;

export const DetailsWrapper = styled.div`
    flex-direction: column;
    flex: 1;
    & > p {
        margin: 0;
    }
`;

const HeaderWrapper = styled.div<{ clickable: boolean }>`
    display: flex;
    align-items: baseline;
    & > h6 {
        margin: 0;
        flex: 1.4;
        color: ${(props): string =>
            props.clickable ? COLORS.mossGreen : COLORS.black};
    }
    & > p {
        margin: 0;
        flex: 1;
        text-align: right;
    }
`;

export const BookmarkWrapper = styled.div`
    margin-left: 80px;
    margin-top: -15px;
`;

type McDetailsProps = {
    mcPkgDetails: McPkgPreview;
    isBookmarked?: boolean;
    offlinePlanningState?: boolean;
    clickable?: boolean;
};

const McDetails = ({
    mcPkgDetails,
    isBookmarked = false,
    offlinePlanningState = false,
    clickable = true,
}: McDetailsProps): JSX.Element => {
    const { history, url, api, params } = useCommonHooks();

    return (
        <McDetailsWrapper
            onClick={(): void => {
                if (clickable) {
                    history.push(`${url}/MC/${mcPkgDetails.id}`);
                }
            }}
            key={mcPkgDetails.mcPkgNo}
            clickable={clickable}
            as={clickable ? 'a' : 'article'}
        >
            <StatusImageWrapper>
                <McPackageStatusIcon status={mcPkgDetails.status} />
                <StatusTextWrapper>
                    {mcPkgDetails.commissioningHandoverStatus !=
                    'NOCERTIFICATE' ? (
                        <HandoverStatus
                            accepted={
                                mcPkgDetails.commissioningHandoverStatus ===
                                'ACCEPTED'
                            }
                        >
                            C
                        </HandoverStatus>
                    ) : null}
                    {mcPkgDetails.operationHandoverStatus != 'NOCERTIFICATE' ? (
                        <HandoverStatus
                            accepted={
                                mcPkgDetails.operationHandoverStatus ===
                                'ACCEPTED'
                            }
                        >
                            O
                        </HandoverStatus>
                    ) : null}
                </StatusTextWrapper>
            </StatusImageWrapper>
            <DetailsWrapper>
                <HeaderWrapper clickable={clickable}>
                    <h6>{mcPkgDetails.mcPkgNo}</h6>
                    <Caption>{mcPkgDetails.commPkgNo}</Caption>
                    <Caption>{mcPkgDetails.responsibleCode}</Caption>
                </HeaderWrapper>
                <Caption>{mcPkgDetails.description}</Caption>
                <Caption>{mcPkgDetails.phaseCode}</Caption>
            </DetailsWrapper>
            {offlinePlanningState && (
                <BookmarkWrapper>
                    <Button
                        variant="ghost_icon"
                        onClick={(e: React.MouseEvent<HTMLElement>): void => {
                            e.stopPropagation();
                            handleClickedBookmark();
                        }}
                    >
                        <EdsIcon
                            color={COLORS.mossGreen}
                            name={
                                isBookmarked
                                    ? 'bookmark_filled'
                                    : 'bookmark_outlined'
                            }
                        />
                    </Button>
                </BookmarkWrapper>
            )}
        </McDetailsWrapper>
    );
};

export default McDetails;
