import { CommPkg, CompletionStatus } from '../../services/apiTypes';
import * as FakerDataLists from './fakerDataLists';
import FakerRandomEnum from './fakerRandomEnum';
import {
    FakerId,
    FakerDescription,
    FakerCommPkgNo,
    PickRandomFromList,
    FakerSystemId,
} from './fakerSimpleTypes';

export const FakeCommPkg = (): CommPkg => {
    return {
        id: FakerId(),
        commPkgNo: FakerCommPkgNo(5),
        description: FakerDescription(),
        commStatus: FakerRandomEnum(CompletionStatus),
        mcStatus: FakerRandomEnum(CompletionStatus),
        mcPkgCount: 100,
        mcPkgsAcceptedByCommissioning: 100,
        mcPkgsAcceptedByOperation: 200,
        commissioningHandoverStatus: PickRandomFromList(
            FakerDataLists.CommissioningHandoverStatus()
        ),
        operationHandoverStatus: PickRandomFromList(
            FakerDataLists.OperationHandoverStatus()
        ),
        systemId: FakerSystemId(5),
    };
};
