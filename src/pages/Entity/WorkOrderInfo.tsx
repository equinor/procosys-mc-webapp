import React from 'react';
import { McPkgPreview, WoPreview } from '../../services/apiTypes';

type WorkOrderInfoProps = {
    workOrder?: WoPreview | McPkgPreview;
};

const WorkOrderInfo = ({ workOrder }: WorkOrderInfoProps): JSX.Element => {
    return <h4>Work Order info</h4>;
};

export default WorkOrderInfo;
