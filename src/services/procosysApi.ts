import { AxiosInstance, CancelToken } from 'axios';
import {
    PunchAction,
    UpdatePunchData,
    UpdatePunchEndpoint,
} from '../pages/Punch/ClearPunch/useClearPunchFacade';
import { TaskCommentDto } from '../pages/Task/TaskDescription';
import { TaskParameterDto } from '../pages/Task/TaskParameters/TaskParameters';
import {
    Plant,
    Project,
    CommPkgSearchResults,
    CommPkg,
    ChecklistPreview,
    TaskPreview,
    PunchPreview,
    ChecklistResponse,
    PunchCategory,
    PunchType,
    PunchOrganization,
    NewPunch,
    PunchItem,
    Task,
    TaskParameter,
    Attachment,
} from './apiTypes';

type PostAttachmentProps = {
    plantId: string;
    parentId?: string;
    data: FormData;
    title?: string;
};

type ProcosysApiServiceProps = {
    axios: AxiosInstance;
    apiVersion: string;
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
        const camelCasedResponse = data;
        const camelCasedResponseWithSlug = camelCasedResponse.map(
            (plant: Plant) => ({
                ...plant,
                slug: plant.id.substr(4),
            })
        );
        return camelCasedResponseWithSlug as Plant[];
    };

    const getProjectsForPlant = async (plantId: string): Promise<Project[]> => {
        const { data } = await axios.get(
            `Projects?plantId=${plantId}${apiVersion}`
        );
        return data as Project[];
    };

    const getPermissionsForPlant = async (
        plantId: string
    ): Promise<string[]> => {
        const { data } = await axios.get(
            `Permissions?plantId=${plantId}${apiVersion}`
        );
        return data as string[];
    };

    const searchForCommPackage = async (
        query: string,
        projectId: number,
        plantId: string,
        cancelToken?: CancelToken
    ): Promise<CommPkgSearchResults> => {
        const {
            data,
        } = await axios.get(
            `CommPkg/Search?plantId=${plantId}&startsWithCommPkgNo=${query}&includeClosedProjects=false&projectId=${projectId}${apiVersion}`,
            { cancelToken }
        );

        return data as CommPkgSearchResults;
    };

    const getCommPackageDetails = async (
        cancelToken: CancelToken,
        plantId: string,
        commPkgId: string
    ): Promise<CommPkg> => {
        const { data } = await axios.get(
            `CommPkg?plantId=PCS$${plantId}&commPkgId=${commPkgId}${apiVersion}
`,
            { cancelToken: cancelToken }
        );
        return data as CommPkg;
    };

    const getAttachments = async (
        cancelToken: CancelToken,
        endpoint: string
    ): Promise<Attachment[]> => {
        const { data } = await axios.get(`${endpoint}${apiVersion}`, {
            cancelToken: cancelToken,
        });
        return data as Attachment[];
    };

    //------------
    // CHECKLIST
    // -----------

    const getScope = async (
        plantId: string,
        commPkgId: string
    ): Promise<ChecklistPreview[]> => {
        const { data } = await axios.get(
            `CommPkg/Checklists?plantId=PCS$${plantId}&commPkgId=${commPkgId}${apiVersion}`
        );
        return data as ChecklistPreview[];
    };

    const getChecklist = async (
        plantId: string,
        checklistId: string
    ): Promise<ChecklistResponse> => {
        const { data } = await axios.get(
            `Checklist/Comm?plantId=PCS$${plantId}&checklistId=${checklistId}${apiVersion}`
        );
        return data as ChecklistResponse;
    };

    const postSetOk = async (
        plantId: string,
        checklistId: string,
        checkItemId: number
    ): Promise<void> => {
        await axios.post(
            `CheckList/Item/SetOk?plantId=PCS$${plantId}${apiVersion}`,
            {
                CheckListId: checklistId,
                CheckItemId: checkItemId,
            }
        );
    };

    const postSetNA = async (
        plantId: string,
        checklistId: string,
        checkItemId: number
    ): Promise<void> => {
        await axios.post(
            `CheckList/Item/SetNA?plantId=PCS$${plantId}${apiVersion}`,
            {
                CheckListId: checklistId,
                CheckItemId: checkItemId,
            }
        );
    };

    const postClear = async (
        plantId: string,
        checklistId: string,
        checkItemId: number
    ): Promise<void> => {
        await axios.post(
            `CheckList/Item/Clear?plantId=PCS$${plantId}${apiVersion}`,
            {
                CheckListId: checklistId,
                CheckItemId: checkItemId,
            }
        );
    };

    const putMetaTableCell = async (
        plantId: string,
        checkItemId: number,
        checklistId: string,
        columnId: number,
        rowId: number,
        value: string
    ): Promise<void> => {
        await axios.put(
            `CheckList/Item/MetaTableCell?plantId=PCS$${plantId}${apiVersion}`,
            {
                CheckListId: checklistId,
                CheckItemId: checkItemId,
                ColumnId: columnId,
                RowId: rowId,
                Value: value,
            }
        );
    };

    const putChecklistComment = async (
        plantId: string,
        checklistId: string,
        Comment: string
    ): Promise<void> => {
        await axios.put(
            `CheckList/Comm/Comment?plantId=PCS$${plantId}${apiVersion}`,
            { CheckListId: checklistId, Comment: Comment }
        );
    };

    const postSign = async (
        plantId: string,
        checklistId: string
    ): Promise<void> => {
        await axios.post(
            `CheckList/Comm/Sign?plantId=PCS$${plantId}${apiVersion}`,
            checklistId,
            { headers: { 'Content-Type': 'application/json' } }
        );
    };

    const postUnsign = async (
        plantId: string,
        checklistId: string
    ): Promise<void> => {
        await axios.post(
            `CheckList/Comm/Unsign?plantId=PCS$${plantId}${apiVersion}`,
            checklistId,
            { headers: { 'Content-Type': 'application/json' } }
        );
    };

    const getChecklistAttachments = async (
        plantId: string,
        checklistId: string
    ): Promise<Attachment[]> => {
        const { data } = await axios.get(
            `CheckList/Attachments?plantId=PCS$${plantId}&checkListId=${checklistId}&thumbnailSize=32${apiVersion}`
        );
        return data as Attachment[];
    };

    const getChecklistAttachment = async (
        cancelToken: CancelToken,
        plantId: string,
        checklistId: string,
        attachmentId: number
    ): Promise<Blob> => {
        const { data } = await axios.get(
            `CheckList/Attachment?plantId=PCS$${plantId}&checkListId=${checklistId}&attachmentId=${attachmentId}${apiVersion}`,
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

    const deleteChecklistAttachment = async (
        cancelToken: CancelToken,
        plantId: string,
        checklistId: string,
        attachmentId: number
    ): Promise<void> => {
        const dto = {
            CheckListId: parseInt(checklistId),
            AttachmentId: attachmentId,
        };
        await axios.delete(
            `CheckList/Attachment?plantId=PCS$${plantId}&api-version=4.1`,
            { data: dto, cancelToken: cancelToken }
        );
    };

    const postChecklistAttachment = async ({
        plantId,
        parentId,
        data,
        title,
    }: PostAttachmentProps): Promise<void> => {
        await axios.post(
            `CheckList/Attachment?plantId=PCS$${plantId}&checkListId=${parentId}&title=${title}${apiVersion}`,
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
    };

    //------------
    // PUNCH ITEMS
    // -----------

    const getPunchList = async (
        plantId: string,
        commPkgId: string
    ): Promise<PunchPreview[]> => {
        const { data } = await axios.get(
            `CommPkg/PunchList?plantId=PCS$${plantId}&commPkgId=${commPkgId}${apiVersion}`
        );
        return data as PunchPreview[];
    };

    const getPunchCategories = async (
        plantId: string
    ): Promise<PunchCategory[]> => {
        const { data } = await axios.get(
            `PunchListItem/Categories?plantId=PCS$${plantId}${apiVersion}`
        );
        return data as PunchCategory[];
    };

    const getPunchTypes = async (plantId: string): Promise<PunchType[]> => {
        const { data } = await axios.get(
            `PunchListItem/Types?plantId=PCS$${plantId}${apiVersion}`
        );
        return data as PunchType[];
    };

    const getPunchOrganizations = async (
        plantId: string
    ): Promise<PunchOrganization[]> => {
        const { data } = await axios.get(
            `PunchListItem/Organizations?plantId=PCS$${plantId}${apiVersion}`
        );
        return data as PunchOrganization[];
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
        punchItemId: string
    ): Promise<PunchItem> => {
        const { data } = await axios.get(
            `PunchListItem?plantId=PCS$${plantId}&punchItemId=${punchItemId}${apiVersion}`
        );
        return data as PunchItem;
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

    //---------
    // TASKS
    //---------

    const getTasks = async (
        cancelToken: CancelToken,
        plantId: string,
        commPkgId: string
    ): Promise<TaskPreview[]> => {
        const {
            data,
        } = await axios.get(
            `CommPkg/Tasks?plantId=PCS$${plantId}&commPkgId=${commPkgId}${apiVersion}`,
            { cancelToken: cancelToken }
        );
        return data as TaskPreview[];
    };

    const getTask = async (
        cancelToken: CancelToken,
        plantId: string,
        taskId: string
    ): Promise<Task> => {
        const {
            data,
        } = await axios.get(
            `CommPkg/Task?plantId=PCS$${plantId}&taskId=${taskId}${apiVersion}`,
            { cancelToken: cancelToken }
        );
        return data as Task;
    };

    const postTaskSign = async (
        cancelToken: CancelToken,
        plantId: string,
        taskId: string
    ): Promise<void> => {
        await axios.post(
            `CommPkg/Task/Sign?plantId=PCS$${plantId}${apiVersion}`,
            taskId,
            {
                cancelToken: cancelToken,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    };

    const postTaskUnsign = async (
        cancelToken: CancelToken,
        plantId: string,
        taskId: string
    ): Promise<void> => {
        await axios.post(
            `CommPkg/Task/Unsign?plantId=PCS$${plantId}${apiVersion}`,
            taskId,
            {
                cancelToken: cancelToken,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    };

    const putTaskComment = async (
        cancelToken: CancelToken,
        plantId: string,
        dto: TaskCommentDto
    ): Promise<void> => {
        await axios.put(
            `CommPkg/Task/Comment?plantId=PCS$${plantId}${apiVersion}`,
            dto,
            { cancelToken: cancelToken }
        );
    };

    const getTaskParameters = async (
        cancelToken: CancelToken,
        plantId: string,
        taskId: string
    ): Promise<TaskParameter[]> => {
        const {
            data,
        } = await axios.get(
            `CommPkg/Task/Parameters?plantId=PCS$${plantId}&taskId=${taskId}${apiVersion}`,
            { cancelToken: cancelToken }
        );
        return data as TaskParameter[];
    };

    const putTaskParameter = async (
        plantId: string,
        dto: TaskParameterDto
    ): Promise<void> => {
        await axios.put(
            `CommPkg/Task/Parameters/Parameter?plantId=PCS$${plantId}${apiVersion}`,
            dto
        );
    };

    const getTaskAttachments = async (
        cancelToken: CancelToken,
        plantId: string,
        taskId: string
    ): Promise<Attachment[]> => {
        const {
            data,
        } = await axios.get(
            `CommPkg/Task/Attachments?plantId=PCS$${plantId}&taskId=${taskId}&thumbnailSize=32${apiVersion}`,
            { cancelToken: cancelToken }
        );
        return data as Attachment[];
    };

    const getTaskAttachment = async (
        cancelToken: CancelToken,
        plantId: string,
        taskId: string,
        attachmentId: number
    ): Promise<Blob> => {
        const { data } = await axios.get(
            `CommPkg/Task/Attachment?plantId=PCS$${plantId}&taskId=${taskId}&attachmentId=${attachmentId}${apiVersion}`,
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
        cancelToken: CancelToken,
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
            { data: dto, cancelToken: cancelToken }
        );
    };

    const postTempPunchAttachment = async ({
        plantId,
        parentId,
        data: formData,
        title,
    }: PostAttachmentProps): Promise<string> => {
        const { data } = await axios.post(
            `PunchListItem/TempAttachment?plantId=PCS$${plantId}${apiVersion}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return data.id as string;
    };

    const postPunchAttachment = async ({
        plantId,
        parentId,
        data,
        title,
    }: PostAttachmentProps): Promise<void> => {
        await axios.post(
            `PunchListItem/Attachment?plantId=PCS$${plantId}&punchItemId=${parentId}&title=${title}${apiVersion}`,
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
    };

    return {
        deleteChecklistAttachment,
        deletePunchAttachment,
        getVersion,
        getAttachments,
        getPunchAttachment,
        getChecklistAttachments,
        getChecklistAttachment,
        getTaskAttachments,
        getTaskAttachment,
        getPunchItem,
        getPlants,
        getProjectsForPlant,
        getPermissionsForPlant,
        getChecklist,
        getCommPackageDetails,
        getPunchOrganizations,
        getPunchList,
        getPunchTypes,
        getPunchCategories,
        getTask,
        getTasks,
        getScope,
        getTaskParameters,
        postClear,
        postSetOk,
        postSetNA,
        postNewPunch,
        postPunchAction,
        postTaskSign,
        postTaskUnsign,
        postPunchAttachment,
        postSign,
        postUnsign,
        postTempPunchAttachment,
        postChecklistAttachment,
        putChecklistComment,
        putMetaTableCell,
        putTaskComment,
        putTaskParameter,
        putUpdatePunch,
        searchForCommPackage,
    };
};

export type ProcosysApiService = ReturnType<typeof procosysApiService>;

export default procosysApiService;
