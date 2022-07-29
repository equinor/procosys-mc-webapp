//import { isArrayOfType } from '@equinor/procosys-webapp-components';
import { AxiosResponse } from 'axios';
import { isChecklistResponse } from './apiTypeGuards';

import { ChecklistResponse, Plant } from './apiTypes';
import { ProcosysApiServiceProps } from './procosysApi';

type httpClientTechnique = 'fetch' | 'axios';

export const procosysApiServiceFetch = (
    {
        axios,
        apiVersion,
        // cb = (res: AxiosResponse<any, any>): AxiosResponse<any, any> => res,
        cb2 = (res: Response): Response => res,
    }: ProcosysApiServiceProps,
    accessToken: string
): void => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getVersion = (): string => {
        return apiVersion;
    };
    const getChecklist = async (
        plantId: string,
        checklistId: string
    ): Promise<ChecklistResponse> => {
        const url = `/api/${getVersion()}/plants/${plantId}/checklists/${checklistId}`;
        const res = cb2(
            await fetch(url, {
                signal,
                method: 'GET',
                headers: { Authorization: `Bearer ${accessToken}` },
            })
        );

        if (!isChecklistResponse(res)) {
            throw new Error('An error occurred, please try again');
        }
        return res;
    };
};
