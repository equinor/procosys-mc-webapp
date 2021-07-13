/* eslint-disable prettier/prettier */
import { CollapsibleCard } from '@equinor/procosys-webapp-components';
import React, { useState } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import AsyncPage from '../../components/AsyncPage';
import ErrorPage from '../../components/error/ErrorPage';
import { AsyncStatus } from '../../contexts/McAppContext';
import { isOfType } from '../../services/apiTypeGuards';
import { McPkgPreview, Tag, WoPreview } from '../../services/apiTypes';

const TagInfoWrapper = styled.main`
    min-height: 0px;
    padding: 16px 4% 0px 4%;
    & p {
        word-break: break-word;
        margin: 0;
    }
`;

type WorkOrderInfoProps = {
    workOrder?: WoPreview | McPkgPreview | Tag;
    fetchWorkOrderStatus: AsyncStatus;
};

const WorkOrderInfo = ({
    workOrder,
    fetchWorkOrderStatus,
}: WorkOrderInfoProps): JSX.Element => {
    if (
        workOrder === undefined ||
        isOfType<WoPreview>(workOrder, 'workOrderNo')
    ) {
        return (
            <AsyncPage
                fetchStatus={fetchWorkOrderStatus}
                errorMessage={'Unable to load Work Order info. Please try again.'}
            >
                <TagInfoWrapper>
                    <CollapsibleCard cardTitle="Description">
                        <p>
                            {workOrder?.description}
                        </p>
                    </CollapsibleCard>
                </TagInfoWrapper>
            </AsyncPage>
        );
    } else {
        return (
            <ErrorPage
                title="Unable to load Work Order info."
                description="The Work Order info page is only available for Work Orders."
            />
        );
    }
};

export default WorkOrderInfo;
