import { objectToCamelCase } from '@equinor/procosys-webapp-components';
import { AxiosInstance } from 'axios';
import { IpoDetails, OutstandingIposType } from './apiTypes';

type ProcosysIPOApiServiceProps = {
    baseURL: string;
    callback?: (res: Response) => Response;
};

type GetOperationProps = {
    abortSignal?: AbortSignal;
    method: string;
    headers: any;
    responseType?: string;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const procosysIPOApiService = (
    {
        baseURL,
        callback = (res: Response): Response => res,
    }: ProcosysIPOApiServiceProps,
    token: string
) => {
    const getByFetch = async (
        url: string,
        abortSignal?: AbortSignal,
        additionalHeaders?: any,
        isBlob?: boolean
    ): Promise<any> => {
        const GetOperation: GetOperationProps = {
            abortSignal: abortSignal,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                ...additionalHeaders,
            },
        };

        if (isBlob) {
            GetOperation.responseType = 'blob';
        }

        const res = callback(await fetch(`${baseURL}/${url}`, GetOperation));
        if (res.ok) {
            const jsonResult = await res.json();
            if (jsonResult instanceof Array) {
                return objectToCamelCase(jsonResult);
            } else {
                if (
                    typeof jsonResult === 'object' &&
                    !(jsonResult instanceof Blob)
                ) {
                    return objectToCamelCase(jsonResult);
                } else {
                    return jsonResult;
                }
            }
        } else {
            alert('HTTP-Error: ' + res.status);
            console.error(res.status);
            return res;
        }
    };

    const getOutstandingIpos = async (
        plantId: string
    ): Promise<OutstandingIposType> => {
        const OutstandingIPOs = await getByFetch(
            `Me/OutstandingIpos?plantId=PCS$${plantId}`
        );
        return OutstandingIPOs;
    };

    const getIpoDetails = async (
        plantId: string,
        id: string
    ): Promise<IpoDetails> => {
        const IpoDetails = await getByFetch(
            `Invitations/${id}/?plantId=PCS$${plantId}`
        );
        return IpoDetails;
    };

    return {
        getOutstandingIpos,
        getIpoDetails,
    };
};

export type ProcosysIPOApiService = ReturnType<typeof procosysIPOApiService>;

export default procosysIPOApiService;
