import {
    APIComment,
    HTTPError,
    IEntity,
    PunchAction,
    PunchPriority,
    SearchType,
    UpdatePunchData,
    getErrorMessage,
    isArrayOfType,
    isOfType,
    objectToCamelCase,
} from '@equinor/procosys-webapp-components';
import { StorageKey } from '@equinor/procosys-webapp-components';
import {
    IpoDetails,
    McPkgPreview,
    NewPunch,
    PoPreview,
    PunchCategory,
    PunchOrganization,
    PunchPreview,
    PunchSort,
} from './apiTypes';
import { Attachment, PunchItem } from './apiTypesCompletionApi';
import { PunchType } from './apiTypes';
import { handleFetchUpdate } from '../offline/handleFetchEvents';
import {
    LibrayTypes,
    PunchComment,
} from '@equinor/procosys-webapp-components/dist/typings/apiTypes';
import { AxiosInstance, CancelToken } from 'axios';
import { category } from '@equinor/eds-icons';

type CompletionApiServiceProps = {
    axios: AxiosInstance;
};

type GetOperationProps = {
    abortSignal?: AbortSignal;
    method: 'GET' | 'POST';
    headers: Record<string, string>;
    body?: string;
};

const headers = (plantId: string, cancelToken?: CancelToken) => {
    return { cancelToken, headers: { 'x-plant': `PCS$${plantId}` } };
};

const typeGuardErrorMessage = (expectedType: string): string => {
    return `Unable to retrieve ${expectedType}. Please try again.`;
};

const completionApiService = ({ axios }: CompletionApiServiceProps) => {
    const getPunchList = async (
        plantId: string,
        cancelToken: CancelToken
    ): Promise<PunchPreview[]> => {
        let url = '';
        url = 'PunchItems';
        const { data } = await axios.get(url, {
            ...headers(plantId, cancelToken),
        });
        if (!isArrayOfType<PunchPreview>(data, 'isRestrictedForUser')) {
            throw new Error(typeGuardErrorMessage('punch preview'));
        }
        return data;
    };

    const getLibraryItems = async (
        plantId: string,
        cancelToken: CancelToken
    ): Promise<LibrayTypes[]> => {
        const { data } = await axios.get(
            `LibraryItems?libraryTypes=PUNCHLIST_TYPE&libraryTypes=COMPLETION_ORGANIZATION&libraryTypes=PUNCHLIST_SORTING&libraryTypes=COMM_PRIORITY`,
            {
                ...headers(plantId, cancelToken),
            }
        );
        return data;
    };

    const getPunchItem = async (
        plantId: string,
        punchItemGuid?: string
    ): Promise<PunchItem> => {
        const { data } = await axios.get(`PunchItems/${punchItemGuid}`, {
            ...headers(plantId),
        });
        return data as PunchItem;
    };

    const getPunchAttachments = async (
        plantId: string,
        guid: string
    ): Promise<Attachment[]> => {
        const { data } = await axios.get(`PunchItems/${guid}/Attachments`, {
            ...headers(plantId),
        });
        return data;
    };

    const getPunchComments = async (
        plantId: string,
        guid: string
    ): Promise<APIComment[]> => {
        const { data } = await axios.get(`PunchItems/${guid}/Comments`, {
            ...headers(plantId),
        });
        return data;
    };

    const postPunchComment = async (
        plantId: string,
        punchItemId: string,
        comment: PunchComment
    ): Promise<void> => {
        await axios.post(`PunchItems/${punchItemId}/Comments`, comment, {
            headers: {
                'Content-Type': 'application/json-patch+json',
                'x-plant': plantId,
            },
        });
    };

    /*  getPunchAttachment: (plantId: string, punchGuid: string, attachmentGuid: string, abortSignal?: AbortSignal) => Promise<Blob>; */
    const getPunchAttachment = async (
        plantId: string,
        punchGuid: string,
        attachmentGuid: string,
        abortSignal?: AbortSignal
    ): Promise<Blob> => {
        const config = {
            responseType: 'blob' as const,
            headers: {
                'x-plant': `PCS$${plantId}`,
                'Content-Disposition': 'attachment; filename="filename.jpg"',
            },
            signal: abortSignal,
        };

        const { data } = await axios.get(
            `PunchItems/${punchGuid}/Attachments/${attachmentGuid}`,
            config
        );
        return data;
    };

    const postPunchAttachment = async (
        plantId: string,
        punchItemId: string,
        file: FormData,
        title: string
    ): Promise<void> => {
        await axios.post(`PunchItems/${punchItemId}/Attachments`, file, {
            headers: {
                'x-plant': `PCS$${plantId}`,
                'Content-Type': 'multipart/form-data',
                'Content-Disposition': `attachment; filename="${title}"`,
            },
        });
    };

    const getPunchTypes = async (
        plantId: string,
        cancelToken: CancelToken
    ): Promise<PunchType[]> => {
        const { data } = await axios.get(
            `LibraryItems?libraryTypes=PUNCHLIST_TYPE`,
            {
                ...headers(plantId, cancelToken),
            }
        );
        return data as PunchType[];
    };

    const getPunchOrganizations = async (
        plantId: string,
        cancelToken: CancelToken
    ): Promise<PunchOrganization[]> => {
        const { data } = await axios.get(
            `LibraryItems?libraryTypes=COMPLETION_ORGANIZATION`,
            { ...headers(plantId, cancelToken) }
        );
        return data as PunchOrganization[];
    };

    const getPunchSorts = async (
        plantId: string,
        cancelToken: CancelToken
    ): Promise<PunchSort[]> => {
        const { data } = await axios.get(
            `LibraryItems?libraryTypes=PUNCHLIST_SORTING`,
            { ...headers(plantId, cancelToken) }
        );
        if (!isArrayOfType<PunchSort>(data, 'code')) {
            throw new Error(typeGuardErrorMessage('punch sorts'));
        }
        return data;
    };

    const getPunchPriorities = async (
        plantId: string,
        cancelToken: CancelToken
    ): Promise<PunchPriority[]> => {
        const { data } = await axios.get(
            `LibraryItems?libraryTypes=COMM_PRIORITY`,
            { ...headers(plantId, cancelToken) }
        );
        if (!isArrayOfType<PunchPriority>(data, 'code')) {
            throw new Error(typeGuardErrorMessage('punch priorities'));
        }
        return data;
    };

    const putUpdatePunch = async (
        plantId: string,
        punchItemGuid: string,
        value: UpdatePunchData,
        path: string,
        rowVersion: string
    ): Promise<void> => {
        const dto = {
            rowVersion,
            patchDocument: [{ value, path, op: 'replace' }],
        };
        await axios.patch(`PunchItems/${punchItemGuid}`, dto, {
            headers: {
                'Content-Type': 'application/json-patch+json',
                'x-plant': `PCS$${plantId}`,
            },
        });
    };
    // Used for clearing, unclearing, rejecting and verifying a
    const postPunchAction = async (
        plantId: string,
        punchGuid: string,
        punchAction: PunchAction,
        rowVersion: string
    ): Promise<string> => {
        if (punchAction === PunchAction.REJECT) {
            const { data } = await axios.post(
                `PunchItems/${punchGuid}/${punchAction}`,
                {
                    rowVersion,
                    comment: 'Reject',
                    mentions: [],
                },
                {
                    ...headers(plantId),
                }
            );
            return data;
        } else {
            const { data } = await axios.post(
                `PunchItems/${punchGuid}/${punchAction}`,
                { rowVersion },
                {
                    ...headers(plantId),
                }
            );
            return data;
        }
    };

    const postNewPunch = async (
        plantId: string,
        newPunchData: NewPunch
    ): Promise<void> => {
        await axios.post(`PunchItems`, newPunchData, { ...headers(plantId) });
    };

    const deletePunchAttachment = async (
        plantId: string,
        punchGuid: string,
        attachmentGuid: string,
        rowVersion: string
    ): Promise<void> => {
        await axios.delete(
            `PunchItems/${punchGuid}/Attachments/${attachmentGuid}`,
            {
                headers: {
                    'x-plant': `PCS$${plantId}`,
                    'Content-Type': 'application/json-patch+json',
                    Accept: 'application/json',
                },
                data: {
                    rowVersion: rowVersion,
                },
            }
        );
    };

    return {
        getPunchAttachments,
        getPunchComments,
        getPunchItem,
        getPunchOrganizations,
        getPunchTypes,
        getPunchSorts,
        getPunchPriorities,
        putUpdatePunch,
        postPunchAction,
        getPunchAttachment,
        getLibraryItems,
        postPunchAttachment,
        postPunchComment,
        postNewPunch,
        deletePunchAttachment,
    };
};

export type CompletionApiService = ReturnType<typeof completionApiService>;
export default completionApiService;
