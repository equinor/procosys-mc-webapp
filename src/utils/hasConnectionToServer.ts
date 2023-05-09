import { HTTPError } from '@equinor/procosys-webapp-components';
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
        if (error instanceof HTTPError) {
            //HTTPError means that we have a connection, but request give error code. Probably because of authentication.
            return true;
        }
        console.error('Not able to get connection to the server. ', error);
        return false;
    }
};

export default hasConnectionToServer;
