import {
    FetchOperationProps,
    HTTPError,
    IEntity,
    PunchAction,
    SearchType,
    UpdatePunchData,
    ChecklistResponse,
    getErrorMessage,
    ItemToMultiSignOrVerify,
    PunchComment,
    APIComment,
} from '@equinor/procosys-webapp-components';
import { SavedSearchType } from '../typings/enums';
import objectToCamelCase from '../utils/objectToCamelCase';
import removeBaseUrlFromUrl from '../utils/removeBaseUrlFromUrl';
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
    Bookmarks,
    IpoDetails,
    EntityId,
    OfflineSynchronizationErrors,
} from './apiTypes';
import { mcFetchGet, mcFetchUpdate } from '../offline/handleFetchEvents';

type ProcosysApiServiceProps = {
    baseURL: string;
    apiVersion: string;
};

export const typeGuardErrorMessage = (expectedType: string): string => {
    return `Unable to retrieve ${expectedType}. Please try again.`;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const procosysApiService = (
    { baseURL, apiVersion }: ProcosysApiServiceProps,
    token: string
) => {
    // General
    const getVersion = (): string => {
        return apiVersion;
    };

    const updateOfflineEntityObj = (
        entity: IEntity,
        resultObj: any,
        apiPath: string
    ): void => {
        entity.responseObj = resultObj;
        entity.apipath = removeBaseUrlFromUrl(apiPath);
    };

    /**
     * Generic method for doing a GET call. Should be used by all GET calls with json string (or blank) as respons.
     */
    const getByFetch = async (
        url: string,
        abortSignal?: AbortSignal,
        entity?: IEntity
    ): Promise<any> => {
        const GetOperation: FetchOperationProps = {
            abortSignal: abortSignal,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const res = await mcFetchGet(`${baseURL}/${url}`, GetOperation);
        if (res.ok) {
            const jsonResult = await res.json();
            const resultObj = objectToCamelCase(jsonResult);
            entity && updateOfflineEntityObj(entity, resultObj, res.url);
            return resultObj;
        } else {
            console.error('Get by fetch failed. Url=' + url, res);
            throw new HTTPError(res.status, res.statusText);
        }
    };

    /**
     * Generic method for doing a GET call with attachment blob as response.
     */
    const getAttachmentByFetch = async (
        url: string,
        abortSignal?: AbortSignal,
        entity?: IEntity
    ): Promise<Blob> => {
        const GetOperation: FetchOperationProps = {
            abortSignal: abortSignal,
            method: 'GET',
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Disposition': 'attachment; filename="filename.jpg"',
            },
        };

        const res = await mcFetchGet(`${baseURL}/${url}`, GetOperation);

        if (res.ok) {
            const blob = await res.blob();

            //ArrayBuffer must be used for storing in indexeddb (blob not supported by all browser, and not supported by Dexie-encrypted)
            const arrayBuffer = await blob.arrayBuffer();
            entity && updateOfflineEntityObj(entity, arrayBuffer, res.url);
            return blob;
        } else {
            console.error('Get attachment by fetch failed. Url=' + url, res);
            throw new HTTPError(res.status, res.statusText);
        }
    };

    /**
     * Generic method for doing a DELETE call. Should be used by all DELETE calls.
     */
    const deleteByFetch = async (url: string, data?: any): Promise<any> => {
        const DeleteOperation: FetchOperationProps = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: data ? JSON.stringify(data) : undefined,
        };
        const response = await mcFetchUpdate(
            `${baseURL}/${url}`,
            DeleteOperation
        );

        if (!response.ok) {
            const errorMessage = await getErrorMessage(response);
            throw new HTTPError(response.status, errorMessage);
        }
    };

    /**
     * Generic method for doing a POST call with json as body data.
     * If the request fails because of http error code from server, HTTPError will be thrown.
     * If the request fails because of network issues etc, Error will be thrown.
     */
    const postByFetch = async (url: string, bodyData?: any): Promise<any> => {
        const PostOperation = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyData),
        };

        let response = new Response();
        try {
            response = await mcFetchUpdate(`${baseURL}/${url}`, PostOperation);
        } catch (error) {
            console.error(
                'Something went wrong when accessing the server.',
                error
            );
            throw new Error('Something went wrong when accessing the server.');
        }

        if (response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                return await response.json();
            } else {
                return;
            }
        } else {
            const errorMessage = await getErrorMessage(response);
            console.error('Error occured on postByFetch', errorMessage);
            throw new HTTPError(response.status, errorMessage);
        }
    };

    /**
     * Generic method for posting attachment with form data as body data.
     */
    const postAttachmentByFetch = async (
        url: string,
        file: FormData,
        returnId: boolean,
        entity?: IEntity
    ): Promise<any> => {
        const PostOperation = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: file,
        };
        const response = await mcFetchUpdate(
            `${baseURL}/${url}`,
            PostOperation
        );
        if (!response.ok) {
            const errorMessage = await getErrorMessage(response);
            throw new HTTPError(response.status, errorMessage);
        }
        if (returnId == true) {
            const jsonResult = await response.json();
            const resultObj = objectToCamelCase(jsonResult);

            entity && updateOfflineEntityObj(entity, resultObj, response.url);

            return resultObj;
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
        const PutOperation = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                ...additionalHeaders,
            },
            body: JSON.stringify(bodyData),
        };
        const response = await mcFetchUpdate(`${baseURL}/${url}`, PutOperation);
        if (!response.ok) {
            const errorMessage = await getErrorMessage(response);
            throw new HTTPError(response.status, errorMessage);
        }
    };

    const getPlants = async (entity?: IEntity): Promise<Plant[]> => {
        const plants = await getByFetch(
            `Plants?includePlantsWithoutAccess=false${apiVersion}`,
            undefined,
            entity
        );
        if (!isArrayOfType<Plant>(plants, 'title')) {
            throw new Error(typeGuardErrorMessage('plants'));
        }
        const plantsWithSlug: Plant[] = plants.map((plant: Plant) => ({
            ...plant,
            slug: plant.id.substring(4),
        }));
        return plantsWithSlug;
    };

    const getProjectsForPlant = async (
        plantId: string,
        entity?: IEntity
    ): Promise<Project[]> => {
        const data = await getByFetch(
            `Projects?plantId=${plantId}${apiVersion}`,
            undefined,
            entity
        );
        if (!isArrayOfType<Project>(data, 'title')) {
            throw new Error(typeGuardErrorMessage('projects'));
        }
        return data;
    };

    const getPermissionsForPlant = async (
        plantId: string,
        entity?: IEntity
    ): Promise<string[]> => {
        const data = await getByFetch(
            `Permissions?plantId=${plantId}${apiVersion}`,
            undefined,
            entity
        );
        return data as string[];
    };

    const getSearchResults = async (
        query: string,
        secondaryQuery: string,
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
            )}&startsWithCallOffNo=${secondaryQuery}&projectId=${projectId}${apiVersion}`;
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
            `SavedSearches?plantId=PCS$${plantId}${apiVersion}`,
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
        abortSignal?: AbortSignal,
        entity?: IEntity
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
        } else if (searchType === SearchType.IPO) {
            url = `IPO?plantId=PCS$${plantId}&invitationId=${entityId}${apiVersion}`;
        } else {
            throw new Error('The chosen scope type is not supported.');
        }
        const data = await getByFetch(url, abortSignal, entity);
        if (!isCorrectDetails(data, searchType)) {
            throw new Error(typeGuardErrorMessage('details'));
        }
        return data;
    };

    const getPunchAttachments = async (
        plantId: string,
        punchItemId: number,
        abortSignal?: AbortSignal,
        entity?: IEntity
    ): Promise<Attachment[]> => {
        const data = await getByFetch(
            `PunchListItem/Attachments?plantId=PCS$${plantId}&punchItemId=${punchItemId}&thumbnailSize=128${apiVersion}`,
            abortSignal,
            entity
        );
        return data as Attachment[];
    };

    //------------
    // BOOKMARKS
    // -----------

    const postSetBookmark = async (
        plantId: string,
        searchType: string,
        entityId: number
    ): Promise<void> => {
        let url = ``;
        if (searchType == SearchType.MC) {
            url = `Bookmark/McPkg?plantId=PCS$${plantId}&mcPkgId=${entityId}${apiVersion}`;
        } else if (searchType == SearchType.Tag) {
            url = `Bookmark/Tag?plantId=PCS$${plantId}&tagId=${entityId}${apiVersion}`;
        } else if (searchType == SearchType.WO) {
            url = `Bookmark/WorkOrder?plantId=PCS$${plantId}&workOrderId=${entityId}${apiVersion}`;
        } else {
            url = `Bookmark/PurchaseOrder?plantId=PCS$${plantId}&callOffId=${entityId}${apiVersion}`;
        }
        await postByFetch(url);
    };

    const getBookmarks = async (
        plantId: string,
        projectId: number | string,
        abortSignal?: AbortSignal,
        entity?: IEntity
    ): Promise<Bookmarks | null> => {
        const data = await getByFetch(
            `OfflineScope?plantId=PCS$${plantId}&projectId=${projectId}${apiVersion}`,
            abortSignal,
            entity
        );
        return data;
    };

    const deleteBookmark = async (
        plantId: string,
        searchType: string,
        entityId: number
    ): Promise<void> => {
        let url = ``;
        if (searchType == SearchType.MC) {
            url = `Bookmark/McPkg?plantId=PCS$${plantId}&mcPkgId=${entityId}${apiVersion}`;
        } else if (searchType == SearchType.Tag) {
            url = `Bookmark/Tag?plantId=PCS$${plantId}&tagId=${entityId}${apiVersion}`;
        } else if (searchType == SearchType.WO) {
            url = `Bookmark/WorkOrder?plantId=PCS$${plantId}&workOrderId=${entityId}${apiVersion}`;
        } else {
            url = `Bookmark/PurchaseOrder?plantId=PCS$${plantId}&callOffId=${entityId}${apiVersion}`;
        }
        await deleteByFetch(url);
    };

    const deleteBookmarks = async (
        plantId: string,
        projectId: number
    ): Promise<void> => {
        await deleteByFetch(
            `Bookmark?plantId=PCS$${plantId}&projectId=${projectId}${apiVersion}`
        );
    };

    //------------
    // CHECKLIST
    // -----------
    const getScope = async (
        plantId: string,
        searchType: SearchType,
        entityId: string,
        ipoDetails: McPkgPreview | WoPreview | Tag | PoPreview | IpoDetails,
        abortSignal?: AbortSignal,
        entity?: IEntity
    ): Promise<ChecklistPreview[]> => {
        let url = '';
        if (searchType === SearchType.MC) {
            url = `McPkg/CheckLists?plantId=PCS$${plantId}&mcPkgId=${entityId}${apiVersion}`;
        } else if (searchType === SearchType.WO) {
            url = `WorkOrder/CheckLists?plantId=PCS$${plantId}&workOrderId=${entityId}${apiVersion}`;
        } else if (searchType === SearchType.Tag) {
            url = `Tag/CheckLists?plantId=PCS$${plantId}&tagId=${entityId}&formularGroupsFilter=${[
                'MCCR',
            ]}${apiVersion}`;
        } else if (searchType === SearchType.PO) {
            url = `PurchaseOrder/CheckLists?plantId=PCS$${plantId}&callOffId=${entityId}&formularGroupsFilter${[
                'MCCR',
            ]}${apiVersion}`;
        } else if (
            searchType === SearchType.IPO &&
            isOfType<IpoDetails>(ipoDetails, 'location')
        ) {
            if (ipoDetails.type == 'DP') {
                const mcPkgNo = ipoDetails.mcPkgScope.map(
                    (mcPkg) => '&mcPkgNos=' + mcPkg.mcPkgNo
                );
                url = `McPkgs/CheckLists?plantId=PCS$${plantId}&projectName=${
                    ipoDetails.projectName
                }${mcPkgNo.join('')}${apiVersion}`;
            } else {
                const commPkgNo = ipoDetails.commPkgScope.map(
                    (commPkg) => '&commPkgNos=' + commPkg.commPkgNo
                );
                url = `CommPkgs/CheckLists?plantId=PCS$${plantId}&projectName=${
                    ipoDetails.projectName
                }${commPkgNo.join('')}${apiVersion}`;
            }
        } else {
            throw new Error('The chosen scope type is not supported.');
        }
        const data = await getByFetch(url, abortSignal, entity);
        if (!isArrayOfType<ChecklistPreview>(data, 'hasElectronicForm')) {
            throw new Error(typeGuardErrorMessage('checklist preview'));
        }
        return data;
    };

    const getChecklist = async (
        plantId: string,
        checklistId: string,
        abortSignal?: AbortSignal,
        entity?: IEntity
    ): Promise<ChecklistResponse> => {
        const data = await getByFetch(
            `CheckList/MC?plantId=PCS$${plantId}&checklistId=${checklistId}${apiVersion}`,
            abortSignal,
            entity
        );
        if (!isChecklistResponse(data)) {
            throw new Error('An error occurred, please try again');
        }
        return data;
    };

    const getChecklistPunchList = async (
        plantId: string,
        checklistId: string,
        abortSignal?: AbortSignal,
        entity?: IEntity
    ): Promise<PunchPreview[]> => {
        const data = await getByFetch(
            `CheckList/PunchList?plantId=PCS$${plantId}&checklistId=${checklistId}${apiVersion}`,
            abortSignal,
            entity
        );
        if (!isArrayOfType<PunchPreview>(data, 'cleared')) {
            throw new Error('An error occurred, please try again.');
        }
        return data;
    };

    const postMultiVerify = async (
        plantId: string,
        checklistId: string,
        targetChecklistIds: number[]
    ): Promise<void> => {
        await postByFetch(
            `CheckList/MC/MultiVerify?plantId=PCS$${plantId}${apiVersion}`,
            {
                OriginalCheckListId: checklistId,
                TargetCheckListIds: targetChecklistIds,
            }
        );
    };

    const postMultiSign = async (
        plantId: string,
        checklistId: string,
        targetChecklistIds: number[],
        copyMetaTable: boolean
    ): Promise<void> => {
        await postByFetch(
            `CheckList/MC/MultiSign?plantId=PCS$${plantId}${apiVersion}`,
            {
                OriginalCheckListId: checklistId,
                TargetCheckListIds: targetChecklistIds,
                CopyMetaTable: copyMetaTable,
            }
        );
    };

    const putChecklistComment = async (
        plantId: string,
        checklistId: string,
        Comment: string
    ): Promise<void> => {
        await putByFetch(
            `CheckList/MC/Comment?plantId=PCS$${plantId}${apiVersion}`,
            { CheckListId: checklistId, Comment: Comment },
            { 'Content-Type': 'application/json' }
        );
    };

    const postUnsign = async (
        plantId: string,
        checklistId: string
    ): Promise<void> => {
        await postByFetch(
            `CheckList/MC/Unsign?plantId=PCS$${plantId}${apiVersion}`,
            checklistId
        );
    };

    const postSign = async (
        plantId: string,
        checklistId: string
    ): Promise<void> => {
        await postByFetch(
            `CheckList/MC/Sign?plantId=PCS$${plantId}${apiVersion}`,
            checklistId
        );
    };

    const getCanMultiSign = async (
        plantId: string,
        checklistId: string,
        abortSignal?: AbortSignal
    ): Promise<ItemToMultiSignOrVerify[]> => {
        const data = await getByFetch(
            `CheckList/MC/CanMultiSign?plantId=PCS$${plantId}&checkListId=${checklistId}${apiVersion}`,
            abortSignal
        );
        if (!isArrayOfType<ItemToMultiSignOrVerify>(data, 'tagNo')) {
            throw new Error(typeGuardErrorMessage('Item To MultiSign'));
        }
        return data;
    };

    const getCanMultiVerify = async (
        plantId: string,
        checklistId: string,
        abortSignal?: AbortSignal
    ): Promise<ItemToMultiSignOrVerify[]> => {
        const data = await getByFetch(
            `CheckList/MC/CanMultiVerify?plantId=PCS$${plantId}&checkListId=${checklistId}${apiVersion}`,
            abortSignal
        );
        if (!isArrayOfType<ItemToMultiSignOrVerify>(data, 'tagNo')) {
            throw new Error(typeGuardErrorMessage('Item To MultiVerify'));
        }
        return data;
    };

    const postUnverify = async (
        plantId: string,
        checklistId: string
    ): Promise<void> => {
        await postByFetch(
            `CheckList/MC/Unverify?plantId=PCS$${plantId}${apiVersion}`,
            checklistId
        );
    };

    const postVerify = async (
        plantId: string,
        checklistId: string
    ): Promise<void> => {
        await postByFetch(
            `CheckList/MC/Verify?plantId=PCS$${plantId}${apiVersion}`,
            checklistId
        );
    };

    const postSetOk = async (
        plantId: string,
        checklistId: string,
        checkItemId: number
    ): Promise<void> => {
        await postByFetch(
            `CheckList/Item/SetOk?plantId=PCS$${plantId}${apiVersion}`,
            {
                CheckListId: checklistId,
                CheckItemId: checkItemId,
            }
        );
    };

    const postCustomSetOk = async (
        plantId: string,
        checklistId: string,
        customCheckItemId: number
    ): Promise<void> => {
        await postByFetch(
            `CheckList/CustomItem/SetOk?plantId=PCS$${plantId}${apiVersion}`,
            {
                CheckListId: checklistId,
                CustomCheckItemId: customCheckItemId,
            }
        );
    };

    const postClear = async (
        plantId: string,
        checklistId: string,
        checkItemId: number
    ): Promise<void> => {
        await postByFetch(
            `CheckList/Item/Clear?plantId=PCS$${plantId}${apiVersion}`,
            {
                CheckListId: checklistId,
                CheckItemId: checkItemId,
            }
        );
    };

    const postCustomClear = async (
        plantId: string,
        checklistId: string,
        customCheckItemId: number
    ): Promise<void> => {
        await postByFetch(
            `CheckList/CustomItem/Clear?plantId=PCS$${plantId}${apiVersion}`,
            {
                CheckListId: checklistId,
                CustomCheckItemId: customCheckItemId,
            }
        );
    };

    const postSetNA = async (
        plantId: string,
        checklistId: string,
        checkItemId: number
    ): Promise<void> => {
        await postByFetch(
            `CheckList/Item/SetNA?plantId=PCS$${plantId}${apiVersion}`,
            {
                CheckListId: checklistId,
                CheckItemId: checkItemId,
            }
        );
    };

    const putMetaTableStringCell = async (
        plantId: string,
        checklistId: string,
        checkItemId: number,
        columnId: number,
        rowId: number,
        value: string
    ): Promise<void> => {
        await putByFetch(
            `CheckList/Item/MetaTableCell?plantId=PCS$${plantId}${apiVersion}`,
            {
                CheckListId: checklistId,
                CheckItemId: checkItemId,
                ColumnId: columnId,
                RowId: rowId,
                Value: value,
            },
            { 'Content-Type': 'application/json' }
        );
    };

    const putMetaTableDateCell = async (
        plantId: string,
        checklistId: string,
        checkItemId: number,
        columnId: number,
        rowId: number,
        value: string
    ): Promise<void> => {
        await putByFetch(
            `CheckList/Item/MetaTableCellDate?plantId=PCS$${plantId}${apiVersion}`,
            {
                CheckListId: checklistId,
                CheckItemId: checkItemId,
                ColumnId: columnId,
                RowId: rowId,
                Value: value,
            },
            { 'Content-Type': 'application/json' }
        );
    };

    const getNextCustomItemNumber = async (
        plantId: string,
        checklistId: string,
        abortSignal?: AbortSignal
    ): Promise<string> => {
        const data = await getByFetch(
            `CheckList/CustomItem/NextItemNo?plantId=PCS$${plantId}&checkListId=${checklistId}${apiVersion}`,
            abortSignal
        );
        return data;
    };

    const postCustomCheckItem = async (
        plantId: string,
        checklistId: string,
        itemNo: string,
        text: string,
        isOk: boolean
    ): Promise<number> => {
        const data = await postByFetch(
            `CheckList/CustomItem?plantId=PCS$${plantId}${apiVersion}`,
            { ItemNo: itemNo, Text: text, IsOk: isOk, ChecklistId: checklistId }
        );
        return data.id;
    };

    const deleteCustomCheckItem = async (
        plantId: string,
        checklistId: string,
        customCheckItemId: number
    ): Promise<void> => {
        await deleteByFetch(
            `CheckList/CustomItem?plantId=PCS$${plantId}${apiVersion}`,
            {
                CustomCheckItemId: customCheckItemId,
                ChecklistId: checklistId,
            }
        );
    };

    //------------
    // PUNCH ITEMS
    // -----------

    const getPunchList = async (
        plantId: string,
        searchType: SearchType,
        entityId: string,
        entityDetails: McPkgPreview | WoPreview | Tag | PoPreview | IpoDetails,
        abortSignal?: AbortSignal,
        entity?: IEntity
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
        } else if (
            searchType === SearchType.IPO &&
            isOfType<IpoDetails>(entityDetails, 'location')
        ) {
            if (entityDetails.type == 'DP') {
                const mcPkgNo = entityDetails.mcPkgScope.map(
                    (mcPkg) => '&mcPkgNos=' + mcPkg.mcPkgNo
                );
                url = `McPkgs/PunchLists?plantId=PCS$${plantId}&projectName=${
                    entityDetails.projectName
                }${mcPkgNo.join('')}${apiVersion}`;
            } else {
                const commPkgNo = entityDetails.commPkgScope.map(
                    (commPkg) => '&commPkgNos=' + commPkg.commPkgNo
                );
                url = `CommPkgs/PunchLists?plantId=PCS$${plantId}&projectName=${
                    entityDetails.projectName
                }${commPkgNo.join('')}${apiVersion}`;
            }
        } else {
            throw new Error('The chosen scope type is not supported.');
        }
        const data = await getByFetch(url, abortSignal, entity);
        if (!isArrayOfType<PunchPreview>(data, 'responsibleCode')) {
            throw new Error(typeGuardErrorMessage('punch preview'));
        }
        return data;
    };

    const getPunchCategories = async (
        plantId: string,
        abortSignal: AbortSignal,
        entity?: IEntity
    ): Promise<PunchCategory[]> => {
        const data = await getByFetch(
            `PunchListItem/Categories?plantId=PCS$${plantId}${apiVersion}`,
            abortSignal,
            entity
        );
        if (!isArrayOfType<PunchCategory>(data, 'code')) {
            throw new Error(typeGuardErrorMessage('punch categories'));
        }
        return data;
    };

    const getPunchTypes = async (
        plantId: string,
        abortSignal: AbortSignal,
        entity?: IEntity
    ): Promise<PunchType[]> => {
        const data = await getByFetch(
            `PunchListItem/Types?plantId=PCS$${plantId}${apiVersion}`,
            abortSignal,
            entity
        );
        if (!isArrayOfType<PunchType>(data, 'code')) {
            throw new Error(typeGuardErrorMessage('punch types'));
        }
        return data;
    };

    const getPunchOrganizations = async (
        plantId: string,
        abortSignal: AbortSignal,
        entity?: IEntity
    ): Promise<PunchOrganization[]> => {
        const data = await getByFetch(
            `PunchListItem/Organizations?plantId=PCS$${plantId}${apiVersion}`,
            abortSignal,
            entity
        );
        if (!isArrayOfType<PunchOrganization>(data, 'code')) {
            throw new Error(typeGuardErrorMessage('punch organizations'));
        }
        return data;
    };

    const getPunchSorts = async (
        plantId: string,
        abortSignal: AbortSignal,
        entity?: IEntity
    ): Promise<PunchSort[]> => {
        const data = await getByFetch(
            `PunchListItem/Sorts?plantId=PCS$${plantId}${apiVersion}`,
            abortSignal,
            entity
        );
        if (!isArrayOfType<PunchSort>(data, 'code')) {
            throw new Error(typeGuardErrorMessage('punch sorts'));
        }
        return data;
    };
    const getPunchPriorities = async (
        plantId: string,
        abortSignal: AbortSignal,
        entity?: IEntity
    ): Promise<PunchPriority[]> => {
        const data = await getByFetch(
            `PunchListItem/Priorities?plantId=PCS$${plantId}${apiVersion}`,
            abortSignal,
            entity
        );
        if (!isArrayOfType<PunchPriority>(data, 'code')) {
            throw new Error(typeGuardErrorMessage('punch priorities'));
        }
        return data;
    };
    const postNewPunch = async (
        plantId: string,
        newPunchData: NewPunch
    ): Promise<EntityId> => {
        const punchId = await postByFetch(
            `PunchListItem?plantId=PCS$${plantId}${apiVersion}`,
            newPunchData
        );
        return punchId;
    };

    const getPunchItem = async (
        plantId: string,
        punchItemId: string,
        abortSignal?: AbortSignal,
        entity?: IEntity
    ): Promise<PunchItem> => {
        const data = await getByFetch(
            `PunchListItem?plantId=PCS$${plantId}&punchItemId=${punchItemId}${apiVersion}`,
            abortSignal,
            entity
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
            dto,
            { 'Content-Type': 'application/json' }
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
            punchItemId
        );
    };

    const getPunchAttachment = async (
        plantId: string,
        punchItemId: number,
        attachmentId: number,
        abortSignal?: AbortSignal,
        entity?: IEntity
    ): Promise<Blob> => {
        const data = await getAttachmentByFetch(
            `PunchListItem/Attachment?plantId=PCS$${plantId}&punchItemId=${punchItemId}&attachmentId=${attachmentId}${apiVersion}`,
            abortSignal,
            entity
        );
        return data as Blob;
    };

    const getPunchComments = async (
        plantId: string,
        punchItemId: number,
        abortSignal?: AbortSignal,
        entity?: IEntity
    ): Promise<APIComment[]> => {
        const data = await getByFetch(
            `PunchListItem/Comments?plantId=PCS$${plantId}&punchItemId=${punchItemId}&${apiVersion}`,
            abortSignal,
            entity
        );
        return data;
    };

    const postPunchComment = async (
        plantId: string,
        comment: PunchComment
    ): Promise<void> => {
        await postByFetch(
            `PunchListItem/AddComment?plantId=PCS$${plantId}${apiVersion}`,
            comment
        );
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
        const data = await postAttachmentByFetch(
            `PunchListItem/TempAttachment?plantId=PCS$${plantId}${apiVersion}`,
            file,
            true
        );
        console.log('data: ', data);
        return data.id as string;
    };

    const postPunchAttachment = async (
        plantId: string,
        punchId: number,
        file: FormData,
        title: string
    ): Promise<void> => {
        await postAttachmentByFetch(
            `PunchListItem/Attachment?plantId=PCS$${plantId}&punchItemId=${punchId}&title=${title}${apiVersion}`,
            file,
            false
        );
    };

    const getPersonsByName = async (
        plantId: string,
        searchString: string,
        abortSignal: AbortSignal,
        entity?: IEntity
    ): Promise<Person[]> => {
        const data = await getByFetch(
            `Person/PersonSearch?plantId=${plantId}&searchString=${searchString}${apiVersion}`,
            abortSignal,
            entity
        );
        if (!isArrayofPerson(data)) {
            throw new Error('An error occurred, please try again.');
        }
        return data;
    };

    const getTag = async (
        plantId: string,
        tagId: number,
        abortSignal?: AbortSignal,
        entity?: IEntity
    ): Promise<Tag> => {
        const data = await getByFetch(
            `Tag?plantId=PCS$${plantId}&tagId=${tagId}${apiVersion}`,
            abortSignal,
            entity
        );
        if (!isOfType<Tag>(data, 'tag')) {
            throw Error(typeGuardErrorMessage('tag'));
        }
        return data;
    };

    const getWorkOrderAttachments = async (
        plantId: string,
        workOrderId: string,
        abortSignal?: AbortSignal,
        entity?: IEntity
    ): Promise<Attachment[]> => {
        const data = await getByFetch(
            `WorkOrder/Attachments?plantId=PCS$${plantId}&workOrderId=${workOrderId}&thumbnailSize=128${apiVersion}`,
            abortSignal,
            entity
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
        abortSignal?: AbortSignal,
        entity?: IEntity
    ): Promise<Blob> => {
        const data = await getAttachmentByFetch(
            `WorkOrder/Attachment?plantId=PCS$${plantId}&workOrderId=${workOrderId}&attachmentId=${attachmentId}${apiVersion}`,
            abortSignal,
            entity
        );
        return data;
    };

    const postWorkOrderAttachment = async (
        plantId: string,
        workOrderId: string,
        title: string,
        file: FormData
    ): Promise<void> => {
        await postAttachmentByFetch(
            `WorkOrder/Attachment?plantId=PCS$${plantId}&workOrderId=${workOrderId}&title=${title}${apiVersion}`,
            file,
            false
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

    const getChecklistAttachments = async (
        plantId: string,
        checklistId: string,
        abortSignal?: AbortSignal,
        entity?: IEntity
    ): Promise<Attachment[]> => {
        const data = await getByFetch(
            `CheckList/Attachments?plantId=PCS$${plantId}&checkListId=${checklistId}&thumbnailSize=128${apiVersion}`,
            abortSignal,
            entity
        );
        return data as Attachment[];
    };

    const getChecklistAttachment = async (
        plantId: string,
        checklistId: string,
        attachmentId: number,
        abortSignal?: AbortSignal,
        entity?: IEntity
    ): Promise<Blob> => {
        const data = await getAttachmentByFetch(
            `CheckList/Attachment?plantId=PCS$${plantId}&checkListId=${checklistId}&attachmentId=${attachmentId}${apiVersion}`,
            abortSignal,
            entity
        );
        return data as Blob;
    };

    const deleteChecklistAttachment = async (
        plantId: string,
        checklistId: string,
        attachmentId: number
    ): Promise<void> => {
        const dto = {
            CheckListId: parseInt(checklistId),
            AttachmentId: attachmentId,
        };
        await deleteByFetch(
            `CheckList/Attachment?plantId=PCS$${plantId}&api-version=4.1`,
            dto
        );
    };

    const postChecklistAttachment = async (
        plantId: string,
        checklistId: string,
        data: FormData,
        title?: string
    ): Promise<void> => {
        await postAttachmentByFetch(
            `CheckList/Attachment?plantId=PCS$${plantId}&checkListId=${checklistId}&title=${title}${apiVersion}`,
            data,
            false
        );
    };

    /**
     * This endpoint need to be called when a synchronization of a project is done (after being offline)
     */
    const putOfflineScopeOffline = async (
        plantId: string,
        projectId: number,
        checkListIds: number[],
        punchListItemIds: number[]
    ): Promise<void> => {
        const dto = {
            CheckListIds: checkListIds,
            PunchListItemIds: punchListItemIds,
            ProjectId: projectId,
        };

        await putByFetch(
            `OfflineScope/Offline?plantId=PCS$${plantId}${apiVersion}`,
            dto,
            { 'Content-Type': 'application/json' }
        );
    };

    /**
     * This endpoint need to be called to finish offline mode for a project. Synchronization must be done first.
     */
    const putOfflineScopeSynchronized = async (
        plantId: string,
        projectId: number
    ): Promise<void> => {
        const dto = { ProjectId: projectId, KeepBookmarks: true };
        await putByFetch(
            `OfflineScope/Synchronized?plantId=PCS$${plantId}${apiVersion}`,
            dto,
            { 'Content-Type': 'application/json' }
        );
    };

    /**
     * This endpoint must be called during offline synchronization, when all updates on a checklist is done.
     */
    const putOfflineScopeChecklistSynchronized = async (
        plantId: string,
        checklistId: number
    ): Promise<void> => {
        const dto = { CheckListId: checklistId };
        await putByFetch(
            `OfflineScope/CheckList/Synchronized?plantId=PCS$${plantId}${apiVersion}`,
            dto,
            { 'Content-Type': 'application/json' }
        );
    };

    /**
     * This endpoint must be called during offline synchronization, when all updates on a punchlist item is done.
     */
    const putOfflineScopePunchlistItemSynchronized = async (
        plantId: string,
        punchlistItemId: number,
        addedOffline: boolean
    ): Promise<void> => {
        const dto = {
            PunchListItemId: punchlistItemId,
            AddedOffline: addedOffline,
        };

        await putByFetch(
            `OfflineScope/PunchListItem/Synchronized?plantId=PCS$${plantId}${apiVersion}`,
            dto,
            { 'Content-Type': 'application/json' }
        );
    };

    /**
     * This endpoint must be called after offline synchronization, if there were errors during synchronization.
     */
    const postOfflineScopeSynchronizeErrors = async (
        plantId: string,
        offlineSynchronizationErrors: OfflineSynchronizationErrors
    ): Promise<void> => {
        await postByFetch(
            `OfflineScope/SynchronizeErrors?plantId=PCS$${plantId}${apiVersion}`,
            offlineSynchronizationErrors
        );
    };

    const putUnderPlanning = async (
        plantId: string,
        projectId: number
    ): Promise<void> => {
        const dto = {
            ProjectId: projectId,
        };
        await putByFetch(
            `OfflineScope/UnderPlanning?plantId=PCS$${plantId}${apiVersion}`,
            dto,
            { 'Content-Type': 'application/json' }
        );
    };

    /**
     * This endpoint returns info about the current application.
     * We use it to ensure that we can access the server, before we start offline syncronization.
     */
    const getApplication = async (): Promise<void> => {
        await getByFetch(`Application?${apiVersion}`);
    };

    return {
        getTag,
        deletePunchAttachment,
        getVersion,
        getPunchAttachments,
        getPunchAttachment,
        getPunchComments,
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
        postPunchComment,
        postTempPunchAttachment,
        putUpdatePunch,
        getSearchResults,
        getEntityDetails,
        postSetBookmark,
        getBookmarks,
        deleteBookmark,
        deleteBookmarks,
        getPersonsByName,
        getSavedSearches,
        deleteSavedSearch,
        getSavedSearchResults,
        getWorkOrderAttachments,
        getWorkOrderAttachment,
        postWorkOrderAttachment,
        deleteWorkOrderAttachment,
        getChecklistAttachments,
        getChecklistAttachment,
        deleteChecklistAttachment,
        postChecklistAttachment,
        postByFetch,
        postAttachmentByFetch,
        deleteByFetch,
        putByFetch,
        putOfflineScopeSynchronized,
        putOfflineScopeChecklistSynchronized,
        putOfflineScopePunchlistItemSynchronized,
        postOfflineScopeSynchronizeErrors,
        putOfflineScopeOffline,
        putUnderPlanning,
        getApplication,
        postMultiSign,
        postMultiVerify,
        putChecklistComment,
        postUnsign,
        postSign,
        getCanMultiSign,
        getCanMultiVerify,
        postUnverify,
        postVerify,
        postSetOk,
        postCustomSetOk,
        postClear,
        postCustomClear,
        postSetNA,
        putMetaTableStringCell,
        putMetaTableDateCell,
        getNextCustomItemNumber,
        postCustomCheckItem,
        deleteCustomCheckItem,
    };
};

export type ProcosysApiService = ReturnType<typeof procosysApiService>;

export default procosysApiService;
