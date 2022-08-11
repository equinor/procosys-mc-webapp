import {
    Entities,
    McPkgPreview,
    PoPreview,
    TagPreview,
    WoPreview,
} from '../services/apiTypes';

import procosysApiService, { ProcosysApiService } from '../services/procosysApi';
import {
    isArrayofPerson,
    isArrayOfType,
    isChecklistResponse,
    isCorrectDetails,
    isCorrectSavedSearchResults,
    isOfType,
} from '../services/apiTypeGuards';
import { SearchType } from '../typings/enums';
import { db } from './db';
import { EntityRepository } from './EntityRepository';
import { Entity } from './Entity';
import { IEntity } from './IEntity';

//

interface Bookmarks {
    Id: string;
    plantId: string;
    projectId: string;
    McPkg: Array<McPkgPreview>;
    Tag: Array<TagPreview>;
    Wo: Array<WoPreview>;
    Po: Array<PoPreview>;
}

const buildOfflineScope = async (bookmarks: Bookmarks): Promise<void> => {
    let latestRes: Response;
    const cbFunc = (res: Response): Response => {
        latestRes = res;
        return res;
    };
    const api: ProcosysApiService = procosysApiService(
        {
            baseURL: 'http://baseUrl',
            apiVersion: '1.4',
            callback: cbFunc,
        },
        'asdfasdf'
    );

    const repository = new EntityRepository();

    bookmarks.McPkg.forEach(async (e: McPkgPreview) => {
        await api.getEntityDetails(
            bookmarks.plantId,
            SearchType.MC,
            e.id.toString()
        );

        const entity: IEntity = {
            entityid: e.id,
            entitytype: SearchType.MC,
            response: latestRes,
            apiPath: latestRes.url,
        };

        await repository.add(entity);
    });
};

export default buildOfflineScope;

// const getMcPky = async (EntityId: number, url: string): Promise<McPkgPreview> => {
//     const { data } = await axios.get(url, { cancelToken });
//     if (!isCorrectDetails(data, searchType)) {
//         throw new Error(typeGuardErrorMessage('details'));
//     }
//     return data;
// };

const databaseAddEntity = async (entity: Entities): Promise<void> => {};
