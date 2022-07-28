import {
    PunchAction,
    UpdatePunchData,
} from '@equinor/procosys-webapp-components';
import { AxiosInstance, AxiosResponse, CancelToken } from 'axios';
import { SavedSearchType, SearchType } from '../typings/enums';
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
} from './apiTypes';

export type ProcosysApiServiceProps = {
    axios: AxiosInstance;
    apiVersion: string;
    cb?: (res: AxiosResponse<any, any>) => AxiosResponse<any, any>;
    cb2?: (res: Response) => Response;
};

export const typeGuardErrorMessage = (expectedType: string): string => {
    return `Unable to retrieve ${expectedType}. Please try again.`;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const procosysApiService = ({
    axios,
    apiVersion,
    cb = (res: AxiosResponse<any, any>): AxiosResponse<any, any> => res,
    cb2 = (res: Response): Response => res,
}: ProcosysApiServiceProps) => {
    // General
    const getVersion = (): string => {
        return apiVersion;
    };
    const getPlants = async (): Promise<Plant[]> => {
        const { data } = cb(
            await axios.get(
                `Plants?includePlantsWithoutAccess=false${apiVersion}`
            )
        );

        if (!isArrayOfType<Plant>(data, 'title')) {
            throw new Error(typeGuardErrorMessage('plants'));
        }
        const plantsWithSlug = data.map((plant: Plant) => ({
            ...plant,
            slug: plant.id.substr(4),
        }));
        return plantsWithSlug;
    };

    const getProjectsForPlant = async (plantId: string): Promise<Project[]> => {
        const { data } = await axios.get(
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
        const { data } = await axios.get(
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
        cancelToken: CancelToken
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
        const { data } = await axios.get(url, { cancelToken });
        if (!isOfType<SearchResults>(data, 'maxAvailable')) {
            throw new Error(typeGuardErrorMessage('search results'));
        }
        return data;
    };

    const getSavedSearches = async (
        plantId: string,
        cancelToken: CancelToken
    ): Promise<SavedSearch[]> => {
        const { data } = await axios.get(
            `/SavedSearches?plantId=PCS$${plantId}${apiVersion}`,
            {
                cancelToken,
            }
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
        await axios.delete(
            `Search?plantId=PCS$${plantId}&savedSearchId=${savedSearchId}${apiVersion}`
        );
    };

    const getSavedSearchResults = async (
        plantId: string,
        savedSearchId: string,
        savedSearchType: string,
        cancelToken: CancelToken,
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
        const { data } = await axios.get(url, {
            cancelToken,
        });
        if (!isCorrectSavedSearchResults(data, savedSearchType)) {
            throw new Error(typeGuardErrorMessage('saved search results'));
        }
        return data;
    };

    const getEntityDetails = async (
        plantId: string,
        searchType: string,
        entityId: string,
        cancelToken: CancelToken
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
        const { data } = await axios.get(url, { cancelToken });
        if (!isCorrectDetails(data, searchType)) {
            throw new Error(typeGuardErrorMessage('details'));
        }
        return data;
    };

    const getPunchAttachments = async (
        plantId: string,
        punchItemId: number,
        cancelToken: CancelToken
    ): Promise<Attachment[]> => {
        const { data } = await axios.get(
            `PunchListItem/Attachments?plantId=PCS$${plantId}&punchItemId=${punchItemId}&thumbnailSize=128${apiVersion}`,
            {
                cancelToken: cancelToken,
            }
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
        cancelToken: CancelToken
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
        const { data } = await axios.get(url, { cancelToken });
        if (!isArrayOfType<ChecklistPreview>(data, 'hasElectronicForm')) {
            throw new Error(typeGuardErrorMessage('checklist preview'));
        }
        return data;
    };

    const getChecklist = async (
        plantId: string,
        checklistId: string,
        cancelToken: CancelToken
    ): Promise<ChecklistResponse> => {
        const { data } = await axios.get(
            `CheckList/MC?plantId=PCS$${plantId}&checklistId=${checklistId}${apiVersion}`,
            { cancelToken }
        );
        if (!isChecklistResponse(data)) {
            throw new Error('An error occurred, please try again');
        }
        return data;
    };

    const getChecklistPunchList = async (
        plantId: string,
        checklistId: string,
        cancelToken: CancelToken
    ): Promise<PunchPreview[]> => {
        const { data } = await axios.get(
            `CheckList/PunchList?plantId=PCS$${plantId}&checklistId=${checklistId}${apiVersion}`,
            { cancelToken }
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
        cancelToken: CancelToken
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
        const { data } = await axios.get(url, { cancelToken });
        if (!isArrayOfType<PunchPreview>(data, 'responsibleCode')) {
            throw new Error(typeGuardErrorMessage('punch preview'));
        }
        return data;
    };

    const getPunchCategories = async (
        plantId: string,
        cancelToken: CancelToken
    ): Promise<PunchCategory[]> => {
        const { data } = await axios.get(
            `PunchListItem/Categories?plantId=PCS$${plantId}${apiVersion}`,
            { cancelToken }
        );
        if (!isArrayOfType<PunchCategory>(data, 'code')) {
            throw new Error(typeGuardErrorMessage('punch categories'));
        }
        return data;
    };

    const getPunchTypes = async (
        plantId: string,
        cancelToken: CancelToken
    ): Promise<PunchType[]> => {
        const { data } = await axios.get(
            `PunchListItem/Types?plantId=PCS$${plantId}${apiVersion}`,
            { cancelToken }
        );
        if (!isArrayOfType<PunchType>(data, 'code')) {
            throw new Error(typeGuardErrorMessage('punch types'));
        }
        return data;
    };

    const getPunchOrganizations = async (
        plantId: string,
        cancelToken: CancelToken
    ): Promise<PunchOrganization[]> => {
        const { data } = await axios.get(
            `PunchListItem/Organizations?plantId=PCS$${plantId}${apiVersion}`,
            { cancelToken }
        );
        if (!isArrayOfType<PunchOrganization>(data, 'code')) {
            throw new Error(typeGuardErrorMessage('punch organizations'));
        }
        return data;
    };

    const getPunchSorts = async (
        plantId: string,
        cancelToken: CancelToken
    ): Promise<PunchSort[]> => {
        const { data } = await axios.get(
            `PunchListItem/Sorts?plantId=PCS$${plantId}${apiVersion}`,
            { cancelToken }
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
            `PunchListItem/Priorities?plantId=PCS$${plantId}${apiVersion}`,
            { cancelToken }
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
        await axios.post(
            `PunchListItem?plantId=PCS$${plantId}${apiVersion}`,
            newPunchData
        );
    };

    const getPunchItem = async (
        plantId: string,
        punchItemId: string,
        cancelToken: CancelToken
    ): Promise<PunchItem> => {
        const { data } = await axios.get(
            `PunchListItem?plantId=PCS$${plantId}&punchItemId=${punchItemId}${apiVersion}`,
            { cancelToken }
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
        await axios.put(
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
        await axios.post(
            `PunchListItem/${punchAction}?plantId=PCS$${plantId}${apiVersion}`,
            punchItemId,
            { headers: { 'Content-Type': 'application/json' } }
        );
    };

    const getPunchAttachment = async (
        cancelToken: CancelToken,
        plantId: string,
        punchItemId: number,
        attachmentId: number
    ): Promise<Blob> => {
        const { data } = await axios.get(
            `PunchListItem/Attachment?plantId=PCS$${plantId}&punchItemId=${punchItemId}&attachmentId=${attachmentId}${apiVersion}`,
            {
                cancelToken: cancelToken,
                responseType: 'blob',
                headers: {
                    'Content-Disposition':
                        'attachment; filename="filename.jpg"',
                },
            }
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
        await axios.delete(
            `PunchListItem/Attachment?plantId=PCS$${plantId}${apiVersion}`,
            { data: dto }
        );
    };

    const postTempPunchAttachment = async (
        plantId: string,
        file: FormData,
        title: string
    ): Promise<string> => {
        const { data } = await axios.post(
            `PunchListItem/TempAttachment?plantId=PCS$${plantId}${apiVersion}`,
            file,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return data.id as string;
    };

    const postPunchAttachment = async (
        plantId: string,
        punchId: number,
        file: FormData,
        title: string
    ): Promise<void> => {
        await axios.post(
            `PunchListItem/Attachment?plantId=PCS$${plantId}&punchItemId=${punchId}&title=${title}${apiVersion}`,
            file,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
    };

    const getPersonsByName = async (
        plantId: string,
        searchString: string,
        cancelToken: CancelToken
    ): Promise<Person[]> => {
        const { data } = await axios.get(
            `Person/PersonSearch?plantId=${plantId}&searchString=${searchString}${apiVersion}`,
            { cancelToken }
        );
        if (!isArrayofPerson(data)) {
            throw new Error('An error occurred, please try again.');
        }
        return data;
    };

    const getTag = async (
        plantId: string,
        tagId: number,
        cancelToken: CancelToken
    ): Promise<Tag> => {
        const { data } = await axios.get(
            `Tag?plantId=PCS$${plantId}&tagId=${tagId}${apiVersion}`,
            { cancelToken }
        );
        if (!isOfType<Tag>(data, 'tag')) {
            throw Error(typeGuardErrorMessage('tag'));
        }
        return data;
    };

    const getWorkOrderAttachments = async (
        plantId: string,
        workOrderId: string,
        cancelToken: CancelToken
    ): Promise<Attachment[]> => {
        const { data } = await axios.get(
            `WorkOrder/Attachments?plantId=PCS$${plantId}&workOrderId=${workOrderId}&thumbnailSize=128${apiVersion}`,
            { cancelToken }
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
        cancelToken: CancelToken
    ): Promise<Blob> => {
        const { data } = await axios.get(
            `WorkOrder/Attachment?plantId=PCS$${plantId}&workOrderId=${workOrderId}&attachmentId=${attachmentId}${apiVersion}`,
            {
                cancelToken: cancelToken,
                responseType: 'blob',
                headers: {
                    'Content-Disposition':
                        'attachment; filename="filename.jpg"',
                },
            }
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
        await axios.post(
            `WorkOrder/Attachment?plantId=PCS$${plantId}&workOrderId=${workOrderId}&title=${title}${apiVersion}`,
            file,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
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
        await axios.delete(
            `WorkOrder/Attachment?plantId=PCS$${plantId}${apiVersion}`,
            { data: dto }
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
