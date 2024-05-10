import {
    APIComment,
    Attachment,
    HTTPError,
    IEntity,
    PunchPriority,
    SearchType,
    getErrorMessage,
    isArrayOfType,
    isOfType,
    objectToCamelCase,
} from '@equinor/procosys-webapp-components';
import { StorageKey } from '@equinor/procosys-webapp-components';
import { IpoDetails, McPkgPreview, PoPreview, PunchCategory, PunchItem, PunchOrganization, PunchPreview, PunchSort, Tag, WoPreview } from './apiTypes';
import { typeGuardErrorMessage } from './procosysApi';
import { R } from 'msw/lib/glossary-de6278a9';
import { PunchListItem } from './apiTypesCompletionApi';
import { PunchType } from './apiTypes';

type CompletionApiServiceProps = {
    baseURL: string;
    callback?: (res: any, url: string) => void;
};

type GetOperationProps = {
    abortSignal?: AbortSignal;
    method: 'GET' | 'POST';
    headers: Record<string, string>;
    body?: string;
};

const apiVersion = '&api-version=1.0';

const completionApiService = ({ baseURL, callback }: CompletionApiServiceProps, token: string) => {
    const callApi = async (url: string, options: GetOperationProps) => {
        const response = await fetch(`${baseURL}/${url}`, options);
        if (response.ok) {
            const jsonResult = await response.json();
            const resultObj = objectToCamelCase(jsonResult);
            callback?.(resultObj, response.url);
            return resultObj;
        } else {
            throw new HTTPError(response.status, await getErrorMessage(response));
        }
    };

    const getByFetch = async (
        url: string,
        abortSignal?: AbortSignal,
        additionalHeaders?: Record<string, string>,
        entity?: IEntity
    ) => {
        const plant = window.localStorage.getItem(StorageKey.PLANT);
        const headers: Record<string, string> = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...additionalHeaders
        };
        if (plant) {
            headers['x-plant'] = `PCS$${plant}`;
        }
        return callApi(url, { abortSignal, method: 'GET', headers });
    };

    const getLibraryItems = async (
        plantId: string,
        libraryTypes: string[],
        abortSignal?: AbortSignal
    ): Promise<any[]> => {  
        const headers: Record<string, string> = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'x-plant': `PCS$${plantId}`
        };
    
        const queryString = libraryTypes.map(type => `libraryTypes=${type}`).join('&');
        const url = `/LibraryItems?${queryString}&api-version=1.0`;
    
        const result = await callApi(url, { method: 'GET', headers, abortSignal });
        return result as any[];  // Type assertion here
    };
    


    const postByFetch = async ( 
        url: string,
        body: any,
        abortSignal?: AbortSignal,
        additionalHeaders?: Record<string, string>
    ) => {
        const plant = window.localStorage.getItem(StorageKey.PLANT);
        const headers: Record<string, string> = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...additionalHeaders
        };
        if (plant) {
            headers['x-plant'] = `PCS$${plant}`;
        }
        return callApi(url, { abortSignal, method: 'POST', headers, body: JSON.stringify(body) });
    };

    const getPunchItem = async (
        proCoSysGuid?: string,
    ): Promise<PunchListItem> => {
        const data = await getByFetch(
            `PunchItems/${proCoSysGuid}`,
        );
        console.log("data: ", proCoSysGuid)
        /*
        if (!isOfType<PunchItem>(data, 'raisedByCode')) {
            console.log("trowing error")
            throw new Error(typeGuardErrorMessage('punchItem'));
        }
        */
        console.log("punchItem: ", data)
        return data as PunchListItem;
    };


    const getPunchAttachments = async (
        plantId: string,
        punchItemId: number,
        entity?: IEntity
    ): Promise<Attachment[]> => {
        const data = await getByFetch(
            `PunchItems/${punchItemId}/Attachments`,
        
        );
        return data as Attachment[];
    };

    const getPunchComments = async (
        proCoSysGuid?: string,
    ): Promise<APIComment[]> => {
        console.log('getPunchComments called');
        console.log('proCoSysGuid: ', proCoSysGuid)
        const data = await getByFetch ( 
            `PunchItems/${proCoSysGuid}/Comments`,
        );
        return data as APIComment[] ;
    };


    const getPunchOrganizations = async (plantId: string, abortSignal?: AbortSignal): Promise<PunchOrganization[]> => {
        const data = await getLibraryItems(plantId, ['COMPLETION_ORGANIZATION'], abortSignal);
        if (!isArrayOfType<PunchOrganization>(data, 'code')) {
            throw new Error(typeGuardErrorMessage('punch categories'));
        }
        return data;
    };

    const getPunchPriorities = async (plantId: string, abortSignal?: AbortSignal): Promise<PunchPriority[]> => {
        const data = await getLibraryItems(plantId, ['PUNCHLIST_PRIORITY'], abortSignal);
        if (!isArrayOfType<PunchPriority>(data, 'code')) {
            throw new Error(typeGuardErrorMessage('punch priorities'));
        }
        return data;
    };

    const getPunchSorts = async (plantId: string, abortSignal?: AbortSignal): Promise<PunchSort[]> => {
        const data = await getLibraryItems(plantId, ['PUNCHLIST_SORTING'], abortSignal);
        if (!isArrayOfType<PunchSort>(data, 'code')) {
            throw new Error(typeGuardErrorMessage('punch sorts'));
        }
        return data;
    };

    const getPunchTypes = async (plantId: string, abortSignal?: AbortSignal): Promise<PunchType[]> => {
        const data = await getLibraryItems(plantId, ['PUNCHLIST_TYPE'], abortSignal);
        if (!isArrayOfType<PunchType>(data, 'code')) {
            throw new Error(typeGuardErrorMessage('punch types'));
        }
        return data;
    };



    return { getByFetch, postByFetch, getPunchAttachments , getPunchComments, getPunchItem, getPunchOrganizations, getPunchTypes, getPunchSorts, getPunchPriorities};
};

export type CompletionApiService = ReturnType<typeof completionApiService>;
export default completionApiService;
