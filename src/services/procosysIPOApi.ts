import {
    HTTPError,
    getErrorMessage,
    objectToCamelCase,
} from '@equinor/procosys-webapp-components';
import { IpoDetails, OutstandingIposType } from './apiTypes';
import { StorageKey } from '@equinor/procosys-webapp-components';

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
    { baseURL }: ProcosysIPOApiServiceProps,
    token: string
) => {
    const callback = (resultObj: any, apiPath: string): string => resultObj;

    const getByFetch = async (
        url: string,
        abortSignal?: AbortSignal,
        additionalHeaders?: any
    ): Promise<any> => {
        const plantInStorage = window.localStorage.getItem(StorageKey.PLANT);
        let headers;
        if (plantInStorage !== undefined) {
            headers = {
                Authorization: `Bearer ${token}`,
                'x-plant': `PCS$${plantInStorage}`,
                ...additionalHeaders,
            };
        } else {
            headers = {
                Authorization: `Bearer ${token}`,
                ...additionalHeaders,
            };
        }
        const GetOperation: GetOperationProps = {
            abortSignal: abortSignal,
            method: 'GET',
            headers: headers,
        };

        const res = await fetch(`${baseURL}/${url}`, GetOperation);
        if (res.ok) {
            const jsonResult = await res.json();
            const resultObj = objectToCamelCase(jsonResult);
            callback(resultObj, res.url);
            return resultObj;
        } else {
            console.error('Get by fetch failed. Url=' + url, res);
            throw new HTTPError(res.status, res.statusText);
        }
    };

    /**
     * Generic method for doing a PUT call.
     */
    const putByFetch = async (
        url: string,
        bodyData: any,
        additionalHeaders?: any
    ): Promise<any> => {
        const plantInStorage = window.localStorage.getItem(StorageKey.PLANT);
        let headers;
        if (plantInStorage !== undefined) {
            headers = {
                Authorization: `Bearer ${token}`,
                'x-plant': `PCS$${plantInStorage}`,
                ...additionalHeaders,
            };
        } else {
            headers = {
                Authorization: `Bearer ${token}`,
                ...additionalHeaders,
            };
        }
        const PutOperation = {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(bodyData),
        };
        const response = await fetch(`${baseURL}/${url}`, PutOperation);
        if (!response.ok) {
            const errorMessage = await getErrorMessage(response);
            throw new HTTPError(response.status, errorMessage);
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
        id: string | number
    ): Promise<IpoDetails> => {
        const IpoDetails = await getByFetch(
            `Invitations/${id}/?plantId=PCS$${plantId}`
        );
        return IpoDetails;
    };

    const putAttendedStatus = async (
        ipoId: number | string,
        participantId: number,
        attended: boolean,
        rowVersion: string
    ): Promise<void> => {
        const endpoint = `Invitations/${ipoId}/AttendedStatus`;
        putByFetch(
            endpoint,
            { id: participantId, attended, rowVersion },
            { 'Content-Type': 'application/json' }
        );
    };

    const putNote = async (
        ipoId: number | string,
        participantId: number,
        note: string,
        rowVersion: string
    ): Promise<void> => {
        const endpoint = `Invitations/${ipoId}/Note`;
        putByFetch(
            endpoint,
            { id: participantId, note, rowVersion },
            { 'Content-Type': 'application/json' }
        );
    };

    return {
        getOutstandingIpos,
        getIpoDetails,
        putAttendedStatus,
        putNote,
    };
};

export type ProcosysIPOApiService = ReturnType<typeof procosysIPOApiService>;

export default procosysIPOApiService;
