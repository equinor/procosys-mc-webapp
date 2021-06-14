import { AxiosInstance, CancelToken } from 'axios';
import {
    PunchAction,
    UpdatePunchData,
    UpdatePunchEndpoint,
} from '../pages/Punch/ClearPunch/useClearPunchFacade';
import { SearchType } from '../pages/Search/Search';
import {
    isArrayOfChecklistPreview,
    isArrayofPerson,
    isArrayOfPunchCategory,
    isArrayOfPunchOrganization,
    isArrayOfPunchPreview,
    isArrayOfPunchPriority,
    isArrayOfPunchSort,
    isArrayOfPunchType,
    isArrayOfType,
    isChecklistResponse,
    isCorrectPreview,
    isCorrectSearchResults,
    isOfType,
    isTagResponse,
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
} from './apiTypes';

type ProcosysApiServiceProps = {
    axios: AxiosInstance;
    apiVersion: string;
};

const typeGuardErrorMessage = (expectedType: string): string => {
    return `Unable to retrieve ${expectedType}. Please try again.`;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const procosysApiService = ({ axios, apiVersion }: ProcosysApiServiceProps) => {
    // General
    const getVersion = (): string => {
        return apiVersion;
    };
    const getPlants = async (): Promise<Plant[]> => {
        const { data } = await axios.get(
            `Plants?includePlantsWithoutAccess=false${apiVersion}`
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
        projectId: number,
        plantId: string,
        searchType: SearchType,
        cancelToken: CancelToken
    ): Promise<SearchResults> => {
        let url = '';
        if (searchType === SearchType.MC) {
            url = `McPkg/Search?plantId=${plantId}&startsWithMcPkgNo=${query}&includeClosedProjects=false&projectId=${projectId}${apiVersion}`;
        } else {
            throw new Error('An error occurred, please try again.');
        }
        const { data } = await axios.get(url, { cancelToken });
        if (!isCorrectSearchResults(data, searchType)) {
            throw new Error('An error occurred, please try again.');
        }
        return data;
    };

    const getItemDetails = async (
        plantId: string,
        searchType: string,
        itemId: string,
        cancelToken: CancelToken
    ): Promise<McPkgPreview> => {
        let url = '';
        if (searchType === SearchType.MC) {
            url = `McPkg?plantId=PCS$${plantId}&mcPkgId=${itemId}${apiVersion}`;
        } else {
            throw new Error('The chosen scope type is not supported.');
        }
        const { data } = await axios.get(url, { cancelToken });
        if (!isCorrectPreview(data, searchType)) {
            throw new Error('An error occurred, please try again.');
        }
        return data;
    };

    const getPunchAttachments = async (
        plantId: string,
        punchItemId: string,
        cancelToken: CancelToken
    ): Promise<Attachment[]> => {
        const { data } = await axios.get(
            `PunchListItem/Attachments?plantId=PCS$${plantId}&punchItemId=${punchItemId}&thumbnailSize=32${apiVersion}`,
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
        itemId: string,
        cancelToken: CancelToken
    ): Promise<ChecklistPreview[]> => {
        let url = '';
        if (searchType === SearchType.MC) {
            url = `McPkg/CheckLists?plantId=PCS$${plantId}&mcPkgId=${itemId}${apiVersion}`;
        } else {
            throw new Error('The chosen scope type is not supported.');
        }
        const { data } = await axios.get(url, { cancelToken });
        if (!isArrayOfChecklistPreview(data)) {
            throw new Error('An error occurred, please try again.');
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
        itemId: string,
        cancelToken: CancelToken
    ): Promise<PunchPreview[]> => {
        let url = '';
        if (searchType === SearchType.MC) {
            url = `McPkg/PunchList?plantId=PCS$${plantId}&mcPkgId=${itemId}${apiVersion}`;
        } else {
            throw new Error('The chosen scope type is not supported.');
        }
        const { data } = await axios.get(url, { cancelToken });
        if (!isArrayOfPunchPreview(data)) {
            throw new Error('An error occurred, please try again.');
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
        if (!isArrayOfPunchCategory(data)) {
            throw new Error('An error occurred, please try again.');
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
        if (!isArrayOfPunchType(data)) {
            throw new Error('An error occurred, please try again.');
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
        if (!isArrayOfPunchOrganization(data)) {
            throw new Error('An error occurred, please try again.');
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
        if (!isArrayOfPunchSort(data)) {
            throw new Error('An error occurred, please try again.');
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
        if (!isArrayOfPunchPriority(data)) {
            throw new Error('An error occurred, please try again.');
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
        endpoint: UpdatePunchEndpoint
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
        punchItemId: string,
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
        punchItemId: string,
        attachmentId: number
    ): Promise<void> => {
        const dto = {
            PunchItemId: parseInt(punchItemId),
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
        punchId: string,
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
        try {
            if (!isTagResponse(data)) {
                console.error(
                    'Expected a tag to be returned, instead got: ',
                    data
                );
                throw new Error('An error occurred, please try again');
            }
        } catch {
            console.error('Expected a tag to be returned, instead got: ', data);
            throw new Error('An error occurred, please try again');
        }

        return data;
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
        getItemDetails,
        getPersonsByName,
    };
};

export type ProcosysApiService = ReturnType<typeof procosysApiService>;

export default procosysApiService;
