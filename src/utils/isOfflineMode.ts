import { StatusRepository } from '../offline/StatusRepository';

/**
 * Fetches the offline status from the browser database. If status is not found, false will be returned.
 */
async function IsOfflineMode(): Promise<boolean | undefined> {
    const statusRepository = new StatusRepository();
    try {
        const status = await statusRepository.getStatus();
        if (status !== undefined) {
            return status.status;
        }
    } catch (err) {
        console.error(err);
    }
    console.error(
        'Not able to get offline status. Will continue in online mode.'
    );
    return true;
}

export default IsOfflineMode;
