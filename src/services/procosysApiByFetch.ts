import { SearchType } from '../typings/enums';
import {
    isArrayOfType,
    isChecklistResponse,
    isCorrectDetails,
} from './apiTypeGuards';

import {
    ChecklistResponse,
    McPkgPreview,
    Plant,
    PoPreview,
    PunchPreview,
    Tag,
    WoPreview,
} from './apiTypes';
import { IAuthService } from './authService';
import { typeGuardErrorMessage } from './procosysApi';

type httpClientTechnique = 'fetch' | 'axios';

export type procosysApiByFetchProps = {
    baseURL: string;
    apiVersion: string;
    cb2?: (res: Response) => Response;
};

const procosysApiByFetchService = (
    {
        baseURL,
        apiVersion,
        cb2 = (res: Response): Response => res,
    }: procosysApiByFetchProps,
    token: string
) => {
    const accessToken = token;

    const controller = new AbortController();
    const signal = controller.signal;

    const standardGET = {
        signal,
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
    };

    const getVersion = (): string => {
        return apiVersion;
    };
    const getChecklist = async (
        plantId: string,
        checklistId: string
    ): Promise<ChecklistResponse> => {
        const url = `/api/${getVersion()}/plants/${plantId}/checklists/${checklistId}`;
        const res = cb2(await fetch(url, standardGET));

        if (!isChecklistResponse(res)) {
            throw new Error('An error occurred, please try again');
        }
        return res;
    };
    const getChecklistPunchList = async (
        plantId: string,
        checklistId: string
    ): Promise<PunchPreview[]> => {
        const res = await fetch(
            `CheckList/PunchList?plantId=PCS$${plantId}&checklistId=${checklistId}${apiVersion}`,
            standardGET
        );
        if (!isArrayOfType<PunchPreview>(res, 'cleared')) {
            throw new Error('An error occurred, please try again.');
        }
        return res;
    };

    const getEntityDetails = async (
        plantId: string,
        searchType: string,
        entityId: string
    ): Promise<McPkgPreview | WoPreview | Tag | PoPreview> => {
        let url = '';
        if (searchType === SearchType.MC) {
            url = `McPkg?plantId=PCS$${plantId}&mcPkgId=${entityId}${apiVersion}`;
        } else if (searchType === SearchType.WO) {
            url = `WorkOrder?plantId=PCS$${plantId}&WorkOrderId=${entityId}${apiVersion}`;
        } else if (searchType === SearchType.Tag) {
            url = `Tag?plantId=PCS$${plantId}&tagId=${entityId}${apiVersion}`;
        } else if (searchType === SearchType.PO) {
            url = `PurchaseOrder?plantId=PCS$${plantId}&callOffId=${entityId}${apiVersion}`;
        } else {
            throw new Error('The chosen scope type is not supported.');
        }
        const res: Response = await fetch(url, standardGET);
        if (!isCorrectDetails(res, searchType)) {
            throw new Error(typeGuardErrorMessage('details'));
        }
        return res;
    };

    return {
        getPlants,
        getProjects,
        getVersion,
        getChecklist,
        getChecklistPunchList,
        getEntityDetails,
    };
};

export type ProcosysApiByFetchService = ReturnType<
    typeof procosysApiByFetchService
>;

export default procosysApiByFetchService;
