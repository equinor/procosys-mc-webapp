import { Button, Checkbox, Progress, Scrim } from '@equinor/eds-core-react';
import {
    CollapsibleCard,
    EntityDetails,
    isOfType,
    PageHeader,
    StorageKey,
} from '@equinor/procosys-webapp-components';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import EdsIcon from '../../components/icons/EdsIcon';
import { db } from '../../offline/db';
import {
    getOfflineProjectIdfromLocalStorage,
    updateOfflineStatus,
} from '../../offline/OfflineStatus';
import { OfflineSynchronizationErrors } from '../../services/apiTypes';
import { COLORS } from '../../style/GlobalStyles';
import {
    LocalStorage,
    OfflineScopeStatus,
    OfflineStatus,
} from '../../typings/enums';
import useCommonHooks from '../../utils/useCommonHooks';
import { ButtonsWrapper } from './Bookmarks/Bookmarks';
import { BookmarksPopup } from './Bookmarks/BookmarksPopups';

const ErrorsWrapper = styled.div`
    margin: -16px 0 66px 0;
`;

const ButtonWrapper = styled.div`
    display: flex;
    margin-top: 12px;
    & > :first-child {
        margin-right: 12px;
    }
`;
interface SyncErrorProps {
    syncErrors: OfflineSynchronizationErrors | null;
    setSyncErrors: React.Dispatch<
        React.SetStateAction<OfflineSynchronizationErrors | null>
    >;
    url: string;
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
}

const SyncErrors = ({
    syncErrors,
    setSyncErrors,
    url,
    setSnackbarText,
}: SyncErrorProps): JSX.Element => {
    const currentPlant = localStorage.getItem(StorageKey.PLANT);
    const currentProject = getOfflineProjectIdfromLocalStorage();
    const { setOfflineState, api, history } = useCommonHooks();

    const [showDeleteConfirmation, setShowDeleteConfirmation] =
        useState<boolean>(false);

    const [isSure, setIsSure] = useState<boolean>(false);

    const [resyncStarted, setResyncStarted] = useState<boolean>(false);

    useEffect(() => {
        if (!syncErrors) {
            history.push(`${url}/bookmarks`);
        }
    }, [syncErrors]);

    const deleteFailedUpdates = async (): Promise<void> => {
        try {
            //Set offline scope to synchronized and elete offline database.
            if (currentPlant && currentProject) {
                const bookmarks = await api.getBookmarks(
                    currentPlant,
                    currentProject
                );
                if (
                    bookmarks?.openDefinition.status ==
                    OfflineScopeStatus.IS_OFFLINE
                ) {
                    await api.putOfflineScopeSynchronized(
                        currentPlant,
                        currentProject
                    );
                }
            }

            await db.delete();
            setOfflineState(OfflineStatus.ONLINE);
            updateOfflineStatus(OfflineStatus.ONLINE, '');
            localStorage.removeItem(LocalStorage.SYNCH_ERRORS);
            setSyncErrors(null);
        } catch (error) {
            if (!(error instanceof Error)) return;
            setSnackbarText(error.message);
        }
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
                    The reason for the error(s) might be legitimate, and could
                    be caused caused by modifications done by other users. You
                    should read the issues before retrying the synchronization.
                    By deleting the failed offline changes, they will be lost.
                </p>
                <p>
                    Note that these errors need to be handled before you can go
                    offline again.
                </p>
                <p>
                    Details describing the error(s) encountered is listed below.
                    Contact support for any questions regarding the error(s).
                </p>
            </CollapsibleCard>
            <ButtonWrapper>
                <Button
                    onClick={(): void => {
                        setResyncStarted(true);
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
                    {resyncStarted ? (
                        <>
                            Retry synchronization
                            <Progress.Circular size={16} />
                        </>
                    ) : (
                        <div>Retry synchronization</div>
                    )}
                </Button>
                <Button
                    onClick={(): void => {
                        setShowDeleteConfirmation(true);
                    }}
                >
                    Delete failed offline changes
                </Button>
            </ButtonWrapper>

            {showDeleteConfirmation == true ? (
                <Scrim
                    isDismissable
                    open={showDeleteConfirmation}
                    onClose={(): void => {
                        setShowDeleteConfirmation(false);
                        setIsSure(false);
                    }}
                >
                    <BookmarksPopup>
                        <h3>
                            Do you really wish to delete failed offline changes?
                        </h3>
                        <Checkbox
                            label="I understand that by deleting failed offline changes, I will lose these changes and the corresponding error messages."
                            onClick={(): void => setIsSure((prev) => !prev)}
                        />
                        <ButtonsWrapper>
                            <Button
                                color={'danger'}
                                disabled={!isSure}
                                onClick={(): void => {
                                    setIsSure(false);
                                    deleteFailedUpdates();
                                }}
                                aria-label="Delete"
                            >
                                Yes, delete failed offline changes
                            </Button>
                            <Button
                                onClick={(): void => {
                                    setShowDeleteConfirmation(false);
                                    setIsSure(false);
                                }}
                            >
                                Don&apos;t delete
                            </Button>
                        </ButtonsWrapper>
                    </BookmarksPopup>
                </Scrim>
            ) : null}

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
