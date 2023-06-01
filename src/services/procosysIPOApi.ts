import {
    HTTPError,
    objectToCamelCase,
} from '@equinor/procosys-webapp-components';
import { IpoDetails, OutstandingIposType, SearchResults } from './apiTypes';
import { StorageKey } from '@equinor/procosys-webapp-components';
import { isOfType } from './apiTypeGuards';
import { typeGuardErrorMessage } from './procosysApi';

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

    const getIpoOnSearch = async (
        plantId: string,
        id: string,
        McPkNo: string,
        abortSignal: AbortSignal
    ): Promise<SearchResults> => {
        const searchedIpo = await getByFetch(
            `Invitations?plantId=PCS$${plantId}&IpoIdStartsWith=${id}&McPkgNoStartsWith=${McPkNo}`,
            abortSignal
        );
        const returnResults = {
            maxAvailable: searchedIpo.maxAvailable,
            items: searchedIpo.invitations,
        };
        if (!isOfType<SearchResults>(returnResults, 'maxAvailable')) {
            throw new Error(typeGuardErrorMessage('search results'));
        }

        return returnResults;
    };

    return {
        getOutstandingIpos,
        getIpoDetails,
        getIpoOnSearch,
    };
};

export type ProcosysIPOApiService = ReturnType<typeof procosysIPOApiService>;

export default procosysIPOApiService;
