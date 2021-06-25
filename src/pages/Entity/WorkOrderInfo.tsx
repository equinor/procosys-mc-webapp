import { CollapsibleCard } from '@equinor/procosys-webapp-components';
import React from 'react';
import styled from 'styled-components';
import AsyncPage from '../../components/AsyncPage';
import { AsyncStatus } from '../../contexts/McAppContext';
import { McPkgPreview, WoPreview } from '../../services/apiTypes';

const TagInfoWrapper = styled.main`
    min-height: 0px;
    padding: 16px 4% 0px 4%;
    & p {
        word-break: break-word;
        margin: 0;
    }
`;

type WorkOrderInfoProps = {
    workOrder?: WoPreview | McPkgPreview;
    fetchWorkOrderStatus: AsyncStatus;
};

const WorkOrderInfo = ({
    workOrder,
    fetchWorkOrderStatus,
}: WorkOrderInfoProps): JSX.Element => {
    return (
        <AsyncPage
            fetchStatus={fetchWorkOrderStatus}
            errorMessage={'Unable to load tag info. Please try again.'}
        >
            <TagInfoWrapper>
                <CollapsibleCard cardTitle="Description">
                    <p>{workOrder?.description}</p>
                </CollapsibleCard>
            </TagInfoWrapper>
        </AsyncPage>
    );
};

export default WorkOrderInfo;
