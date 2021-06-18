import greyStatus from '../../assets/img/scopeStatusGrey.png';
import greenStatus from '../../assets/img/status/ok.svg';
import paStatus from '../../assets/img/scopeStatusPa.png';
import pbStatus from '../../assets/img/scopeStatusPb.png';
import React from 'react';
import { CompletionStatus } from '../../services/apiTypes';
import styled from 'styled-components';

const StatusImage = styled.img`
    width: 24px;
    height: 24px;
    object-fit: contain;
`;

type CompletionStatusIconProps = {
    status: CompletionStatus;
};

const CompletionStatusIcon = ({
    status,
}: CompletionStatusIconProps): JSX.Element => {
    if (status === CompletionStatus.OS) {
        return <StatusImage src={greyStatus} alt="OS" />;
    }
    if (status === CompletionStatus.OK) {
        return <StatusImage src={greenStatus} alt="OK" />;
    }
    if (status === CompletionStatus.PA) {
        return <StatusImage src={paStatus} alt="PA" />;
    }
    if (status === CompletionStatus.PB) {
        return <StatusImage src={pbStatus} alt="PB" />;
    }
    return <></>;
};

export default CompletionStatusIcon;
