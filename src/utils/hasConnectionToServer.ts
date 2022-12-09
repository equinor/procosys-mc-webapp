import { ProcosysApiService } from '../services/procosysApi';

/**
 * This function can be used to verify that we have internet connection, and are able to connect to the server.
 */
const hasConnectionToServer = async (
    api: ProcosysApiService
): Promise<boolean> => {
    try {
        await api.getApplication();
        return true;
    } catch (error) {
        return false;
    }
};

export default hasConnectionToServer;
