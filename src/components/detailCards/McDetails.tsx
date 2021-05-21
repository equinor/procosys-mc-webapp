import React from 'react';
import styled from 'styled-components';
import { Caption, COLORS } from '../../style/GlobalStyles';
import { McPkgPreview } from '../../services/apiTypes';
import { McPackageStatusIcon } from '../icons/McPackageStatusIcon';
import useCommonHooks from '../../utils/useCommonHooks';

const McDetailsWrapper = styled.article<{ clickable: boolean }>`
    cursor: pointer;
    display: flex;
    border-top: 1px solid ${COLORS.lightGrey};
    padding: 12px 4%;
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
    & > img {
        height: 20px;
    }
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

type McDetailsProps = {
    searchResult: McPkgPreview;
    clickable?: boolean;
};

const McDetails = ({
    searchResult,
    clickable = true,
}: McDetailsProps): JSX.Element => {
    const { history, url } = useCommonHooks();
    return (
        <McDetailsWrapper
            onClick={(): void => {
                if (clickable) {
                    history.push(`${url}/MC/${searchResult.id}`);
                }
            }}
            key={searchResult.mcPkgNo}
            clickable={clickable}
            as={clickable ? 'a' : 'article'}
        >
            <StatusImageWrapper>
                <McPackageStatusIcon status={searchResult.status} />
                <StatusTextWrapper>
                    <HandoverStatus
                        accepted={
                            searchResult.commissioningHandoverStatus ==
                            'ACCEPTED'
                        }
                    >
                        C
                    </HandoverStatus>
                    <HandoverStatus
                        accepted={
                            searchResult.operationHandoverStatus == 'ACCEPTED'
                        }
                    >
                        O
                    </HandoverStatus>
                </StatusTextWrapper>
            </StatusImageWrapper>
            <DetailsWrapper>
                <HeaderWrapper clickable={clickable}>
                    <h6>{searchResult.mcPkgNo}</h6>
                    <Caption>{searchResult.commPkgNo}</Caption>
                    <Caption>{searchResult.responsibleCode}</Caption>
                </HeaderWrapper>
                <Caption>{searchResult.description}</Caption>
                <Caption>{searchResult.phaseCode}</Caption>
            </DetailsWrapper>
        </McDetailsWrapper>
    );
};

export default McDetails;
