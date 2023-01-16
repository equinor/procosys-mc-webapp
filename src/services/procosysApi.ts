import {
    PunchAction,
    PunchEndpoints,
    UpdatePunchData,
} from '@equinor/procosys-webapp-components';
import { SavedSearchType, SearchType } from '../typings/enums';
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
    Bookmarks,
    IpoDetails,
    EntityId,
    OfflineSynchronizationErrors,
} from './apiTypes';
import { HTTPError } from './HTTPError';

type ProcosysApiServiceProps = {
    baseURL: string;
    apiVersion: string;
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
    { baseURL, apiVersion }: ProcosysApiServiceProps,
    token: string
) => {
    let callback = (resultObj: any, apiPath: string): string => resultObj;

    const setCallbackFunction = (cbFunc: any): void => {
        callback = cbFunc;
    };

    // General
    const getVersion = (): string => {
        return apiVersion;
    };

    /**
     * Generic method for doing a GET call. Should be used by all GET calls with json string (or blank) as respons.
     */
    const getByFetch = async (
        url: string,
        abortSignal?: AbortSignal
    ): Promise<any> => {
        const GetOperation: GetOperationProps = {
            abortSignal: abortSignal,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
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
     * Generic method for doing a GET call with attachment blob as response.
     */
    const getAttachmentByFetch = async (
        url: string,
        abortSignal?: AbortSignal
    ): Promise<Blob> => {
        const GetOperation: GetOperationProps = {
            abortSignal: abortSignal,
            method: 'GET',
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Disposition': 'attachment; filename="filename.jpg"',
            },
        };

        const res = await fetch(`${baseURL}/${url}`, GetOperation);

        if (res.ok) {
            const blob = await res.blob();

            //ArrayBuffer must be used for storing in indexeddb (blob not supported by all browser, and not supported by Dexie-encrypted)
            const arrayBuffer = await blob.arrayBuffer();
            callback(arrayBuffer, res.url);
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
        const DeleteOperation = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: data ? JSON.stringify(data) : null,
        };
        const response = await fetch(`${baseURL}/${url}`, DeleteOperation);

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

        //------KODE FOR Å TESTE FEILHÅNDTERING
        // if (url.includes('PunchListItem?')) {
        //     console.log('HAR URL:', url);
        //     //url = url.replace('PunchListItem', 'PunchListIteeem');

        //     PostOperation = {
        //         method: 'POST',
        //         headers: {
        //             Authorization: `Bearer ${token}`,
        //             'Content-Type': 'application/json',
        //         },
        //         body: 'hallo i luken',
        //     };
        // }
        //------------

        let response = new Response();
        try {
            response = await fetch(`${baseURL}/${url}`, PostOperation);
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
        file: FormData
    ): Promise<any> => {
        const PostOperation = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: file,
        };
        const response = await fetch(`${baseURL}/${url}`, PostOperation);
        if (!response.ok) {
            const errorMessage = await getErrorMessage(response);
            throw new HTTPError(response.status, errorMessage);
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
        console.log('SKAL LAGE PUT: ', PutOperation);
        const response = await fetch(`${baseURL}/${url}`, PutOperation);
        if (!response.ok) {
            const errorMessage = await getErrorMessage(response);
            throw new HTTPError(response.status, errorMessage);
        }
    };

    const getErrorMessage = async (response: Response): Promise<string> => {
        let errorMessage;
        const text = await response.text();
        if (text) {
            errorMessage = text;
        } else {
            errorMessage = `Server responded with http error code ${response.status}. ${response.statusText}`;
        }
        console.error('Error occured on server call.', errorMessage);
        return errorMessage;
    };

    const getPlants = async (): Promise<Plant[]> => {
        const plants = await getByFetch(
            `Plants?includePlantsWithoutAccess=false${apiVersion}`
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
        abortSignal?: AbortSignal
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
        const data = await getByFetch(url, abortSignal);
        if (!isCorrectDetails(data, searchType)) {
            throw new Error(typeGuardErrorMessage('details'));
        }
        return data;
    };

    const getPunchAttachments = async (
        plantId: string,
        punchItemId: number,
        abortSignal?: AbortSignal
    ): Promise<Attachment[]> => {
        const data = await getByFetch(
            `PunchListItem/Attachments?plantId=PCS$${plantId}&punchItemId=${punchItemId}&thumbnailSize=128${apiVersion}`,
            abortSignal
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
        projectId: number,
        abortSignal: AbortSignal
    ): Promise<Bookmarks | null> => {
        const data = await getByFetch(
            `OfflineScope?plantId=PCS$${plantId}&projectId=${projectId}${apiVersion}`,
            abortSignal
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

    const putCancelOffline = async (
        plantId: string,
        projectId: number
    ): Promise<void> => {
        await putByFetch(
            `OfflineScope/Cancel?plantId=PCS$${plantId}${apiVersion}`,
            {
                ProjectId: projectId,
            },
            { 'Content-Type': 'application/json' }
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
        abortSignal?: AbortSignal
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
        const data = await getByFetch(url, abortSignal);
        if (!isArrayOfType<ChecklistPreview>(data, 'hasElectronicForm')) {
            throw new Error(typeGuardErrorMessage('checklist preview'));
        }
        return data;
    };

    const getChecklist = async (
        plantId: string,
        checklistId: string,
        abortSignal?: AbortSignal
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
        abortSignal?: AbortSignal
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
        entityDetails: McPkgPreview | WoPreview | Tag | PoPreview | IpoDetails,
        abortSignal?: AbortSignal
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
        const data = await getByFetch(
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
        const data = await getByFetch(
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
        const data = await getByFetch(
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
        const data = await getByFetch(
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
        abortSignal?: AbortSignal
    ): Promise<PunchItem> => {
        const data = await getByFetch(
            `PunchListItem?plantId=PCS$${plantId}&punchItemId=${punchItemId}${apiVersion}`,
            abortSignal
        );
        if (!isOfType<PunchItem>(data, 'raisedByCode')) {
            throw new Error(typeGuardErrorMessage('punchItem'));
        }
        console.log('har hentet punch: ', data);
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
        abortSignal?: AbortSignal
    ): Promise<Blob> => {
        const data = await getAttachmentByFetch(
            `PunchListItem/Attachment?plantId=PCS$${plantId}&punchItemId=${punchItemId}&attachmentId=${attachmentId}${apiVersion}`,
            abortSignal
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
        const data = await postAttachmentByFetch(
            `PunchListItem/TempAttachment?plantId=PCS$${plantId}${apiVersion}`,
            file
        );
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
            file
        );
    };

    const getPersonsByName = async (
        plantId: string,
        searchString: string,
        abortSignal: AbortSignal
    ): Promise<Person[]> => {
        const data = await getByFetch(
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
        abortSignal?: AbortSignal
    ): Promise<Tag> => {
        const data = await getByFetch(
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
        abortSignal?: AbortSignal
    ): Promise<Attachment[]> => {
        const data = await getByFetch(
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
        abortSignal?: AbortSignal
    ): Promise<Blob> => {
        const data = await getAttachmentByFetch(
            `WorkOrder/Attachment?plantId=PCS$${plantId}&workOrderId=${workOrderId}&attachmentId=${attachmentId}${apiVersion}`,
            abortSignal
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
            file
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
        abortSignal?: AbortSignal
    ): Promise<Attachment[]> => {
        const data = await getByFetch(
            `CheckList/Attachments?plantId=PCS$${plantId}&checkListId=${checklistId}&thumbnailSize=128${apiVersion}`,
            abortSignal
        );
        return data as Attachment[];
    };

    const getChecklistAttachment = async (
        plantId: string,
        checklistId: string,
        attachmentId: number,
        abortSignal?: AbortSignal
    ): Promise<Blob> => {
        const data = await getAttachmentByFetch(
            `CheckList/Attachment?plantId=PCS$${plantId}&checkListId=${checklistId}&attachmentId=${attachmentId}${apiVersion}`,
            abortSignal
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
            data
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
        const dto = { ProjectId: projectId };
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
        postSetBookmark,
        getBookmarks,
        deleteBookmark,
        putCancelOffline,
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
        setCallbackFunction,
        postByFetch,
        postAttachmentByFetch,
        deleteByFetch,
        putByFetch,
        putOfflineScopeSynchronized,
        putOfflineScopeChecklistSynchronized,
        putOfflineScopePunchlistItemSynchronized,
        postOfflineScopeSynchronizeErrors,
        putOfflineScopeOffline,
        getApplication,
    };
};

export type ProcosysApiService = ReturnType<typeof procosysApiService>;

export default procosysApiService;
