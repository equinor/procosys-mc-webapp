import React from 'react';
import styled from 'styled-components';
import { Caption, COLORS } from '../../style/GlobalStyles';
import { McPkgPreview, WoPreview } from '../../services/apiTypes';
import useCommonHooks from '../../utils/useCommonHooks';
import { StatusColumn } from '@equinor/procosys-webapp-components';
import { McPackageStatusIcon } from '../icons/McPackageStatusIcon';

const McDetailsWrapper = styled.article<{ clickable: boolean }>`
    cursor: pointer;
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
    mcPkgDetails: McPkgPreview;
    clickable?: boolean;
};

const McDetails = ({
    mcPkgDetails,
    clickable = true,
}: McDetailsProps): JSX.Element => {
    const { history, url } = useCommonHooks();
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
                <StatusColumn
                    statusIcon={
                        <McPackageStatusIcon status={mcPkgDetails.status} />
                    }
                    statusLetters={[
                        mcPkgDetails.commissioningHandoverStatus == 'ACCEPTED'
                            ? 'C'
                            : null,
                        mcPkgDetails.operationHandoverStatus == 'ACCEPTED'
                            ? 'O'
                            : null,
                    ]}
                />
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
        </McDetailsWrapper>
    );
};

export default McDetails;
