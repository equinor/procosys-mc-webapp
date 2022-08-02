import { SearchType } from './enums';
import objectToCamelCase from './objectToCamelCase';
import {
    isChecklistResponse,
    isArrayOfType,
    isCorrectDetails,
} from './apiTypeGuards';
import {
    ChecklistResponse,
    isPlants,
    isProjects,
    McPkgPreview,
    Plant,
    PoPreview,
    Project,
    PunchPreview,
    Tag,
    WoPreview,
} from './apiTypes';
import { typeGuardErrorMessage } from './procosysApi';

export type procosysApiByFetchProps = {
    baseURL: string;
    apiVersion: string;
    cb2?: (res: Response) => Response;
};

const procosysApiByFetchService = (
    {
        baseURL,
        apiVersion,
        cb2 = (res: Response): Response => res,
    }: procosysApiByFetchProps,
    token: string
) => {
    const convertToCamelCase = <T>(data: Array<T>): Array<T> => {
        try {
            const result = new Array<T>();

            return (data = objectToCamelCase(data).map((type: T) => {
                result.push(type);
            }));
        } catch (error) {
            if (signal.aborted) {
                throw error;
            }
            if (typeof error === 'string') {
                console.log(error);
            }
            if (error instanceof Error) {
                const message = error.message;
                throw new Error(message);
            } else {
                throw new Error('Error occurred, please try again');
            }
        }
    };

    const accessToken = token;
    const controller = new AbortController();
    const signal = controller.signal;

    const GetOperation = {
        signal,
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
    };

    const getPlants = async (): Promise<Plant[]> => {
        const res = await fetch(
            `${baseURL}/Plants?includePlantsWithoutAccess=false${apiVersion}`,
            GetOperation
        );
        if (res.ok) {
            // if HTTP-status is 200-299
            // get the response body (the method explained below)
            const plants = await res.json();
            // const camelCasePlants = convertToCamelCase(plants);

            // if (isPlants(plants.map((p: unknown) => isPlants(p)))) {
            //     throw new Error(typeGuardErrorMessage('plants'));
            // }
            if (plants instanceof Array && isPlants(plants)) {
                const plantsWithSlug: Plant[] = plants.map((plant: Plant) => ({
                    ...plant,
                    slug: plant.id.substr(4),
                }));
                return plantsWithSlug;
            }

            return plants;
        } else {
            alert('HTTP-Error: ' + res.status);
            console.error(res.status);
            return new Array<Plant>();
        }
    };

    const getProjectsForPlant = async (
        plantId: string
    ): Promise<Project[] | Response> => {
        const res = await fetch(`${baseURL}/Projects?plantId=${plantId}${apiVersion}`);

        if (res.ok) {
            if (res.headers.get('Content-Type') === 'application/json') {
                const projects = await res.json();
                if (
                    typeof projects === 'object' &&
                    !(projects instanceof Blob)
                ) {
                    convertToCamelCase(projects);
                } else {
                    return res;
                }

                if (isProjects(projects.map((project: Project) => project))) {
                    throw new Error(typeGuardErrorMessage('projects'));
                }
                return convertToCamelCase(projects);
            }
        } else {
            alert('HTTP-Error: ' + res.status);
            return new Array<Project>();
        }
        return res;
    };

    const getVersion = (): string => {
        return apiVersion;
    };

    const getChecklistPunchList = async (
        plantId: string,
        checklistId: string
    ): Promise<PunchPreview[]> => {
        const res = await fetch(
            `CheckList/PunchList?plantId=PCS$${plantId}&checklistId=${checklistId}${apiVersion}`,
            GetOperation
        );
        if (!isArrayOfType<PunchPreview>(res, 'cleared')) {
            throw new Error('An error occurred, please try again.');
        }
        return res;
    };

    const getEntityDetails = async (
        plantId: string,
        searchType: string,
        entityId: string
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
        const res: Response = await fetch(url, GetOperation);
        if (!isCorrectDetails(res, searchType)) {
            throw new Error(typeGuardErrorMessage('details'));
        }
        return res;
    };

    return {
        getPlants,
        getProjectsForPlant,
        getVersion,
        getChecklistPunchList,
        getEntityDetails,
    };
};

export type ProcosysApiByFetchService = ReturnType<
    typeof procosysApiByFetchService
>;

export default procosysApiByFetchService;
