import { Button } from '@equinor/eds-core-react';
import {
    CollapsibleCard,
    EntityDetails,
    isOfType,
    PageHeader,
    StorageKey,
} from '@equinor/procosys-webapp-components';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import EdsIcon from '../../components/icons/EdsIcon';
import { LocalStorage } from '../../contexts/McAppContext';
import { db } from '../../offline/db';
import {
    getOfflineProjectIdfromLocalStorage,
    updateOfflineStatus,
} from '../../offline/OfflineStatus';
import { OfflineSynchronizationErrors } from '../../services/apiTypes';
import { COLORS } from '../../style/GlobalStyles';
import { OfflineStatus } from '../../typings/enums';
import useCommonHooks from '../../utils/useCommonHooks';

const ErrorsWrapper = styled.div`
    margin: -16px 0 66px 0;
`;
interface SyncErrorProps {
    syncErrors: OfflineSynchronizationErrors | null;
    setSyncErrors: React.Dispatch<
        React.SetStateAction<OfflineSynchronizationErrors | null>
    >;
    url: string;
}

const ButtonWrapper = styled.div`
    display: flex;
    margin-top: 12px;
    & > :first-child {
        margin-right: 12px;
    }
`;

const SyncErrors = ({
    syncErrors,
    setSyncErrors,
    url,
}: SyncErrorProps): JSX.Element => {
    const currentPlant = localStorage.getItem(StorageKey.PLANT);
    const currentProject = getOfflineProjectIdfromLocalStorage();
    const { setOfflineState, api, history } = useCommonHooks();

    useEffect(() => {
        if (!syncErrors) {
            history.push(`${url}/bookmarks`);
        }
    }, [syncErrors]);

    const deleteFailedUpdates = async (): Promise<void> => {
        localStorage.removeItem(LocalStorage.SYNCH_ERRORS);
        //Set offline scope to synchronized and elete offline database.
        if (currentPlant && currentProject) {
            await api.putOfflineScopeSynchronized(currentPlant, currentProject);
        }

        await db.delete();
        setOfflineState(OfflineStatus.ONLINE);
        updateOfflineStatus(OfflineStatus.ONLINE, '');
        setSyncErrors(null);
    };

    return (
        <>
            <PageHeader
                title={
                    'Errors encountered during synchronization of offline work'
                }
            />
            <CollapsibleCard cardTitle="Error Information">
                <p>
                    At least one of the changes made during offline mode could
                    not be synchronized with the server. Any other changes on
                    the same punch/checklist has not been attempted.
                </p>
                <p>
                    The reason for errors might be legitimate, and can be caused
                    by modifications done by other users. You should try to fix
                    the issues before retrying the synchronization. By deleting
                    the failed updates, they will be lost.
                </p>

                <p>
                    Details describing the error(s) encountered is listed below.
                    Contact support for any questions regarding the error(s)
                </p>
            </CollapsibleCard>
            <ButtonWrapper>
                <Button
                    onClick={(): void => {
                        localStorage.setItem(
                            LocalStorage.OFFLINE_STATUS,
                            OfflineStatus.SYNCHING.toString()
                        );
                        //After reloading, the application will be reauthenticated, and
                        //syncronization will be started.
                        //Note: When running tests, location object does not have 'reload'.
                        if (isOfType<Location>(location, 'reload')) {
                            location.reload();
                        }
                    }}
                >
                    Retry synchronization
                </Button>
                <Button onClick={deleteFailedUpdates}>
                    Delete failed updates
                </Button>
            </ButtonWrapper>
            {syncErrors ? (
                <div>
                    {syncErrors.CheckListErrors.length > 0 ? (
                        <div>
                            <h4>Checklists</h4>
                            <ErrorsWrapper>
                                {syncErrors.CheckListErrors.map((error) => (
                                    <EntityDetails
                                        key={error.Id}
                                        isDetailsCard={true}
                                        icon={
                                            <EdsIcon
                                                name="error_outlined"
                                                color={COLORS.danger}
                                            />
                                        }
                                        headerText={error.Id.toString()}
                                        description={error.ErrorMsg}
                                    />
                                ))}
                            </ErrorsWrapper>
                        </div>
                    ) : null}
                    {syncErrors.PunchListItemErrors.length > 0 ? (
                        <div>
                            <h4>Punches</h4>
                            <ErrorsWrapper>
                                {syncErrors.PunchListItemErrors.map((error) => (
                                    <EntityDetails
                                        key={error.Id}
                                        isDetailsCard={true}
                                        icon={
                                            <EdsIcon
                                                name="error_outlined"
                                                color={COLORS.danger}
                                            />
                                        }
                                        headerText={error.Id.toString()}
                                        description={`${error.ErrorCode}: ${error.ErrorMsg}`}
                                    />
                                ))}
                            </ErrorsWrapper>
                        </div>
                    ) : null}
                </div>
            ) : (
                <p>Could not get errors</p>
            )}
        </>
    );
};

export default SyncErrors;
