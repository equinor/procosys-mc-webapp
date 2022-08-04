import {
    PunchAction,
    PunchEndpoints,
    UpdatePunchData,
} from '@equinor/procosys-webapp-components';
import { SavedSearchType } from '../pages/Search/SavedSearches/SavedSearchResult';
import { SearchType } from '../pages/Search/Search';
import objectToCamelCase from '../utils/objectToCamelCase';
import {
    isArrayofPerson,
    isArrayOfType,
    isChecklistResponse,
    isCorrectDetails,
    isCorrectSavedSearchResults,
    isOfType,
} from './apiTypeGuards';
import {
    Plant,
    Project,
    SearchResults,
    ChecklistPreview,
    PunchPreview,
    ChecklistResponse,
    PunchCategory,
    PunchType,
    PunchOrganization,
    NewPunch,
    PunchItem,
    Attachment,
    McPkgPreview,
    PunchSort,
    PunchPriority,
    Person,
    Tag,
    WoPreview,
    PoPreview,
    SavedSearch,
    PunchItemSavedSearchResult,
    ChecklistSavedSearchResult,
    isPlants,
} from './apiTypes';

type ProcosysApiServiceProps = {
    baseURL: string;
    apiVersion: string;
    cb2?: (res: Response) => Response;
};

type GetOperationProps = {
    abortSignal?: AbortSignal;
    method: string;
    headers: any;
    responseType?: string;
};

export const typeGuardErrorMessage = (expectedType: string): string => {
    return `Unable to retrieve ${expectedType}. Please try again.`;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const procosysApiService = (
    {
        baseURL,
        apiVersion,
        cb2 = (res: Response): Response => res,
    }: ProcosysApiServiceProps,
    token: string
) => {
    // General
    const getVersion = (): string => {
        return apiVersion;
    };

    const getByFetch = async (
        url: string,
        abortSignal?: AbortSignal,
        additionalHeaders?: any,
        isBlob?: boolean
    ): Promise<any> => {
        const GetOperation: GetOperationProps = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                ...additionalHeaders,
            },
        };

        if (abortSignal) {
            GetOperation.abortSignal = abortSignal;
        }

        if (isBlob) {
            GetOperation.responseType = 'blob';
        }

        console.log('getOp', GetOperation);

        const res = await fetch(`${baseURL}/${url}`, GetOperation);

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

    const deleteByFetch = async (url: string, bodyData?: any): Promise<any> => {
        const DeleteOperation = {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
            body: bodyData ? JSON.stringify(bodyData) : null,
        };
        await fetch(`${baseURL}/${url}`, DeleteOperation);
    };

    const postByFetch = async (
        url: string,
        bodyData: any,
        additionalHeaders?: any
    ): Promise<any> => {
        const PostOperation = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                ...additionalHeaders,
            },
            body: JSON.stringify(bodyData),
        };
        await fetch(`${baseURL}/${url}`, PostOperation);
    };

    const putByFetch = async (url: string, bodyData: any): Promise<any> => {
        const PutOperation = {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify(bodyData),
        };
        await fetch(`${baseURL}/${url}`, PutOperation);
    };

    const getPlants = async (): Promise<Plant[]> => {
        const plants = await getByFetch(
            `Plants?includePlantsWithoutAccess=false${apiVersion}`
        );

        if (plants instanceof Array && isPlants(plants)) {
            try {
                const plantsWithSlug: Plant[] = plants.map((plant: Plant) => ({
                    ...plant,
                    slug: plant.id.substring(4),
                }));
                return plantsWithSlug;
            } catch (error) {
                console.error(error);
            }
        }
        return plants;
    };

    const getProjectsForPlant = async (plantId: string): Promise<Project[]> => {
        const data = await getByFetch(
            `Projects?plantId=${plantId}${apiVersion}`
        );

        if (!isArrayOfType<Project>(data, 'title')) {
            throw new Error(typeGuardErrorMessage('projects'));
        }
        return data;
    };

    const getPermissionsForPlant = async (
        plantId: string
    ): Promise<string[]> => {
        const data = await getByFetch(
            `Permissions?plantId=${plantId}${apiVersion}`
        );
        return data as string[];
    };

    const getSearchResults = async (
        query: string,
        callOffQuery: string,
        projectId: number,
        plantId: string,
        searchType: string,
        abortSignal: AbortSignal
    ): Promise<SearchResults> => {
        let url = '';
        if (searchType === SearchType.MC) {
            url = `McPkg/Search?plantId=${plantId}&startsWithMcPkgNo=${encodeURIComponent(
                query
            )}&includeClosedProjects=false&projectId=${projectId}${apiVersion}`;
        } else if (searchType === SearchType.WO) {
            url = `WorkOrder/Search?plantId=${plantId}&startsWithWorkOrderNo=${encodeURIComponent(
                query
            )}&includeClosedProjects=false&projectId=${projectId}${apiVersion}`;
        } else if (searchType === SearchType.Tag) {
            url = `Tag/Search?plantId=${plantId}&startsWithTagNo=${encodeURIComponent(
                query
            )}&projectId=${projectId}${apiVersion}`;
        } else if (searchType === SearchType.PO) {
            url = `PurchaseOrder/Search?plantId=${plantId}&startsWithPurchaseOrderNo=${encodeURIComponent(
                query
            )}&startsWithCallOffNo=${callOffQuery}&projectId=${projectId}${apiVersion}`;
        } else {
            throw new Error('An error occurred, please try again.');
        }

        const data = await getByFetch(url, abortSignal);
        if (!isOfType<SearchResults>(data, 'maxAvailable')) {
            throw new Error(typeGuardErrorMessage('search results'));
        }
        return data;
    };

    const getSavedSearches = async (
        plantId: string,
        abortSignal: AbortSignal
    ): Promise<SavedSearch[]> => {
        const data = await getByFetch(
            `/SavedSearches?plantId=PCS$${plantId}${apiVersion}`,
            abortSignal
        );
        if (!isArrayOfType<SavedSearch>(data, 'type')) {
            throw new Error(typeGuardErrorMessage('saved search'));
        }
        return data;
    };

    const deleteSavedSearch = async (
        plantId: string,
        savedSearchId: number
    ): Promise<void> => {
        await deleteByFetch(
            `Search?plantId=PCS$${plantId}&savedSearchId=${savedSearchId}${apiVersion}`
        );
    };

    const getSavedSearchResults = async (
        plantId: string,
        savedSearchId: string,
        savedSearchType: string,
        abortSignal: AbortSignal,
        currentPage = 0
    ): Promise<PunchItemSavedSearchResult[] | ChecklistSavedSearchResult[]> => {
        let url = '';
        if (savedSearchType === SavedSearchType.CHECKLIST) {
            url = `CheckList/Search?plantId=PCS$${plantId}&savedSearchId=${savedSearchId}&currentPage=${currentPage}${apiVersion}`;
        } else if (savedSearchType === SavedSearchType.PUNCH) {
            url = `PunchListItem/Search?plantId=PCS$${plantId}&savedSearchId=${savedSearchId}&currentPage=${currentPage}${apiVersion}`;
        } else {
            throw new Error('The current saved search type is not supported.');
        }
        const data = await getByFetch(url, abortSignal);
        if (!isCorrectSavedSearchResults(data, savedSearchType)) {
            throw new Error(typeGuardErrorMessage('saved search results'));
        }
        return data;
    };

    const getEntityDetails = async (
        plantId: string,
        searchType: string,
        entityId: string,
        abortSignal: AbortSignal
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
        const data = await getByFetch(url, abortSignal);
        if (!isCorrectDetails(data, searchType)) {
            throw new Error(typeGuardErrorMessage('details'));
        }
        return data;
    };

    const getPunchAttachments = async (
        plantId: string,
        punchItemId: number,
        abortSignal: AbortSignal
    ): Promise<Attachment[]> => {
        const data = await getByFetch(
            `PunchListItem/Attachments?plantId=PCS$${plantId}&punchItemId=${punchItemId}&thumbnailSize=128${apiVersion}`,
            abortSignal
        );
        return data as Attachment[];
    };

    //------------
    // CHECKLIST
    // -----------
    const getScope = async (
        plantId: string,
        searchType: SearchType,
        entityId: string,
        abortSignal: AbortSignal
    ): Promise<ChecklistPreview[]> => {
        let url = '';
        if (searchType === SearchType.MC) {
            url = `McPkg/CheckLists?plantId=PCS$${plantId}&mcPkgId=${entityId}${apiVersion}`;
        } else if (searchType === SearchType.WO) {
            url = `WorkOrder/CheckLists?plantId=PCS$${plantId}&workOrderId=${entityId}${apiVersion}`;
        } else if (searchType === SearchType.Tag) {
            url = `Tag/CheckLists?plantId=PCS$${plantId}&tagId=${entityId}${apiVersion}`;
        } else if (searchType === SearchType.PO) {
            url = `PurchaseOrder/CheckLists?plantId=PCS$${plantId}&callOffId=${entityId}${apiVersion}`;
        } else {
            throw new Error('The chosen scope type is not supported.');
        }
        const data = await getByFetch(url, abortSignal);
        if (!isArrayOfType<ChecklistPreview>(data, 'hasElectronicForm')) {
            throw new Error(typeGuardErrorMessage('checklist preview'));
        }
        return data;
    };

    const getChecklist = async (
        plantId: string,
        checklistId: string,
        abortSignal: AbortSignal
    ): Promise<ChecklistResponse> => {
        const data = await getByFetch(
            `CheckList/MC?plantId=PCS$${plantId}&checklistId=${checklistId}${apiVersion}`,
            abortSignal
        );
        if (!isChecklistResponse(data)) {
            throw new Error('An error occurred, please try again');
        }
        return data;
    };

    const getChecklistPunchList = async (
        plantId: string,
        checklistId: string,
        abortSignal: AbortSignal
    ): Promise<PunchPreview[]> => {
        const data = await getByFetch(
            `CheckList/PunchList?plantId=PCS$${plantId}&checklistId=${checklistId}${apiVersion}`,
            abortSignal
        );
        if (!isArrayOfType<PunchPreview>(data, 'cleared')) {
            throw new Error('An error occurred, please try again.');
        }
        return data;
    };

    //------------
    // PUNCH ITEMS
    // -----------
    const getPunchList = async (
        plantId: string,
        searchType: SearchType,
        entityId: string,
        abortSignal: AbortSignal
    ): Promise<PunchPreview[]> => {
        let url = '';
        if (searchType === SearchType.MC) {
            url = `McPkg/PunchList?plantId=PCS$${plantId}&mcPkgId=${entityId}${apiVersion}`;
        } else if (searchType === SearchType.WO) {
            url = `WorkOrder/PunchList?plantId=PCS$${plantId}&workOrderId=${entityId}${apiVersion}`;
        } else if (searchType === SearchType.Tag) {
            url = `Tag/PunchList?plantId=PCS$${plantId}&tagId=${entityId}${apiVersion}`;
        } else if (searchType === SearchType.PO) {
            url = `PurchaseOrder/PunchList?plantId=PCS$${plantId}&callOffId=${entityId}${apiVersion}`;
        } else {
            throw new Error('The chosen scope type is not supported.');
        }
        const data = await getByFetch(url, abortSignal);
        if (!isArrayOfType<PunchPreview>(data, 'responsibleCode')) {
            throw new Error(typeGuardErrorMessage('punch preview'));
        }
        return data;
    };

    const getPunchCategories = async (
        plantId: string,
        abortSignal: AbortSignal
    ): Promise<PunchCategory[]> => {
        const data = await getByFetch(
            `PunchListItem/Categories?plantId=PCS$${plantId}${apiVersion}`,
            abortSignal
        );
        if (!isArrayOfType<PunchCategory>(data, 'code')) {
            throw new Error(typeGuardErrorMessage('punch categories'));
        }
        return data;
    };

    const getPunchTypes = async (
        plantId: string,
        abortSignal: AbortSignal
    ): Promise<PunchType[]> => {
        const { data } = await getByFetch(
            `PunchListItem/Types?plantId=PCS$${plantId}${apiVersion}`,
            abortSignal
        );
        if (!isArrayOfType<PunchType>(data, 'code')) {
            throw new Error(typeGuardErrorMessage('punch types'));
        }
        return data;
    };

    const getPunchOrganizations = async (
        plantId: string,
        abortSignal: AbortSignal
    ): Promise<PunchOrganization[]> => {
        const { data } = await getByFetch(
            `PunchListItem/Organizations?plantId=PCS$${plantId}${apiVersion}`,
            abortSignal
        );
        if (!isArrayOfType<PunchOrganization>(data, 'code')) {
            throw new Error(typeGuardErrorMessage('punch organizations'));
        }
        return data;
    };

    const getPunchSorts = async (
        plantId: string,
        abortSignal: AbortSignal
    ): Promise<PunchSort[]> => {
        const { data } = await getByFetch(
            `PunchListItem/Sorts?plantId=PCS$${plantId}${apiVersion}`,
            abortSignal
        );
        if (!isArrayOfType<PunchSort>(data, 'code')) {
            throw new Error(typeGuardErrorMessage('punch sorts'));
        }
        return data;
    };
    const getPunchPriorities = async (
        plantId: string,
        abortSignal: AbortSignal
    ): Promise<PunchPriority[]> => {
        const { data } = await getByFetch(
            `PunchListItem/Priorities?plantId=PCS$${plantId}${apiVersion}`,
            abortSignal
        );
        if (!isArrayOfType<PunchPriority>(data, 'code')) {
            throw new Error(typeGuardErrorMessage('punch priorities'));
        }
        return data;
    };

    const postNewPunch = async (
        plantId: string,
        newPunchData: NewPunch
    ): Promise<void> => {
        await postByFetch(
            `PunchListItem?plantId=PCS$${plantId}${apiVersion}`,
            newPunchData
        );
    };

    const getPunchItem = async (
        plantId: string,
        punchItemId: string,
        abortSignal: AbortSignal
    ): Promise<PunchItem> => {
        const { data } = await getByFetch(
            `PunchListItem?plantId=PCS$${plantId}&punchItemId=${punchItemId}${apiVersion}`,
            abortSignal
        );
        if (!isOfType<PunchItem>(data, 'raisedByCode')) {
            throw new Error(typeGuardErrorMessage('punchItem'));
        }
        return data;
    };

    const putUpdatePunch = async (
        plantId: string,
        punchItemId: string,
        updateData: UpdatePunchData,
        endpoint: string
    ): Promise<void> => {
        const dto = { PunchItemId: punchItemId, ...updateData };
        await putByFetch(
            `PunchListItem/${endpoint}?plantId=PCS$${plantId}${apiVersion}`,
            dto
        );
    };

    // Used for clearing, unclearing, rejecting and verifying a
    const postPunchAction = async (
        plantId: string,
        punchItemId: string,
        punchAction: PunchAction
    ): Promise<void> => {
        await postByFetch(
            `PunchListItem/${punchAction}?plantId=PCS$${plantId}${apiVersion}`,
            punchItemId,
            { 'Content-Type': 'application/json' }
        );
    };

    const getPunchAttachment = async (
        abortSignal: AbortSignal,
        plantId: string,
        punchItemId: number,
        attachmentId: number
    ): Promise<Blob> => {
        const data = await getByFetch(
            `PunchListItem/Attachment?plantId=PCS$${plantId}&punchItemId=${punchItemId}&attachmentId=${attachmentId}${apiVersion}`,
            abortSignal,
            { 'Content-Disposition': 'attachment; filename="filename.jpg"' },
            true
        );
        return data as Blob;
    };

    const deletePunchAttachment = async (
        plantId: string,
        punchItemId: number,
        attachmentId: number
    ): Promise<void> => {
        const dto = {
            PunchItemId: punchItemId,
            AttachmentId: attachmentId,
        };
        await deleteByFetch(
            `PunchListItem/Attachment?plantId=PCS$${plantId}${apiVersion}`,
            dto
        );
    };

    const postTempPunchAttachment = async (
        plantId: string,
        file: FormData,
        title: string
    ): Promise<string> => {
        const { data } = await postByFetch(
            `PunchListItem/TempAttachment?plantId=PCS$${plantId}${apiVersion}`,
            file,
            { 'Content-Type': 'multipart/form-data' }
        );
        return data.id as string;
    };

    const postPunchAttachment = async (
        plantId: string,
        punchId: number,
        file: FormData,
        title: string
    ): Promise<void> => {
        await postByFetch(
            `PunchListItem/Attachment?plantId=PCS$${plantId}&punchItemId=${punchId}&title=${title}${apiVersion}`,
            file,
            { 'Content-Type': 'multipart/form-data' }
        );
    };

    const getPersonsByName = async (
        plantId: string,
        searchString: string,
        abortSignal: AbortSignal
    ): Promise<Person[]> => {
        const { data } = await getByFetch(
            `Person/PersonSearch?plantId=${plantId}&searchString=${searchString}${apiVersion}`,
            abortSignal
        );
        if (!isArrayofPerson(data)) {
            throw new Error('An error occurred, please try again.');
        }
        return data;
    };

    const getTag = async (
        plantId: string,
        tagId: number,
        abortSignal: AbortSignal
    ): Promise<Tag> => {
        const { data } = await getByFetch(
            `Tag?plantId=PCS$${plantId}&tagId=${tagId}${apiVersion}`,
            abortSignal
        );
        if (!isOfType<Tag>(data, 'tag')) {
            throw Error(typeGuardErrorMessage('tag'));
        }
        return data;
    };

    const getWorkOrderAttachments = async (
        plantId: string,
        workOrderId: string,
        abortSignal: AbortSignal
    ): Promise<Attachment[]> => {
        const { data } = await getByFetch(
            `WorkOrder/Attachments?plantId=PCS$${plantId}&workOrderId=${workOrderId}&thumbnailSize=128${apiVersion}`,
            abortSignal
        );
        if (!isArrayOfType<Attachment>(data, 'fileName')) {
            throw Error(typeGuardErrorMessage('attachments'));
        }
        return data;
    };

    const getWorkOrderAttachment = async (
        plantId: string,
        workOrderId: string,
        attachmentId: number,
        abortSignal: AbortSignal
    ): Promise<Blob> => {
        const data = getByFetch(
            `WorkOrder/Attachment?plantId=PCS$${plantId}&workOrderId=${workOrderId}&attachmentId=${attachmentId}${apiVersion}`,
            abortSignal,
            { 'Content-Disposition': 'attachment; filename="filename.jpg"' },
            true
        );
        if (!isOfType<Blob>(data, 'stream')) {
            throw Error(typeGuardErrorMessage('attachments'));
        }
        return data as Blob;
    };

    const postWorkOrderAttachment = async (
        plantId: string,
        workOrderId: string,
        title: string,
        file: FormData
    ): Promise<void> => {
        await postByFetch(
            `WorkOrder/Attachment?plantId=PCS$${plantId}&workOrderId=${workOrderId}&title=${title}${apiVersion}`,
            file,
            { 'Content-Type': 'multipart/form-data' }
        );
    };

    const deleteWorkOrderAttachment = async (
        plantId: string,
        workOrderId: string,
        attachmentId: number
    ): Promise<void> => {
        const dto = {
            workOrderId: parseInt(workOrderId),
            AttachmentId: attachmentId,
        };
        await deleteByFetch(
            `WorkOrder/Attachment?plantId=PCS$${plantId}${apiVersion}`,
            dto
        );
    };

    return {
        getTag,
        deletePunchAttachment,
        getVersion,
        getPunchAttachments,
        getPunchAttachment,
        getPunchItem,
        getPlants,
        getProjectsForPlant,
        getPermissionsForPlant,
        getChecklist,
        getPunchOrganizations,
        getChecklistPunchList,
        getPunchList,
        getPunchTypes,
        getPunchCategories,
        getPunchSorts,
        getPunchPriorities,
        getScope,
        postNewPunch,
        postPunchAction,
        postPunchAttachment,
        postTempPunchAttachment,
        putUpdatePunch,
        getSearchResults,
        getEntityDetails,
        getPersonsByName,
        getSavedSearches,
        deleteSavedSearch,
        getSavedSearchResults,
        getWorkOrderAttachments,
        getWorkOrderAttachment,
        postWorkOrderAttachment,
        deleteWorkOrderAttachment,
    };
};

export type ProcosysApiService = ReturnType<typeof procosysApiService>;

export default procosysApiService;
