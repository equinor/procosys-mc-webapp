import { CompletionStatus, PunchPreview } from '../services/apiTypes';

const calculateHighestStatus = (
    punchList: PunchPreview[]
): CompletionStatus => {
    if (punchList.find((punch) => punch.status === 'PA'))
        return CompletionStatus.PA;
    if (punchList.find((punch) => punch.status === 'PB'))
        return CompletionStatus.PB;
    return CompletionStatus.OK;
};

export default calculateHighestStatus;
