import { EntityDetails } from '@equinor/procosys-webapp-components';
import {
    Entities,
    McPkgPreview,
    PoPreview,
    TagPreview,
    WoPreview,
} from '../../../../../src/services/apiTypes';
import procosysApiService from '../../../../../src/services/procosysApiService';
import isCorrectDetails from '../../../../../src/services/apiTypeGuards';



interface Bookmarks {
    McPkg: Array<McPkgPreview>;
    Tag: Array<TagPreview>;
    Wo: Array<WoPreview>;
    Po: Array<PoPreview>;
}

const buildOfflineScope = async (bookmarks: Bookmarks): Promise<void> => { };

export default buildOfflineScope;


const getMcPky = (EntityId: number): McPkgPreview => {
    const { data } = await axios.get(url, { cancelToken });
    if (!isCorrectDetails(data, searchType)) {
        throw new Error(typeGuardErrorMessage('details'));
    }
    return data;
};

const databaseAddEntity = async (entity: Entities): Promise<void> => { };