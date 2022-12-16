import { Button } from '@equinor/eds-core-react';
import {
    CollapsibleCard,
    PageHeader,
} from '@equinor/procosys-webapp-components';
import React from 'react';
import { OfflineSynchronizationErrors } from '../../services/apiTypes';

interface SyncErrorProps {
    syncErrors: OfflineSynchronizationErrors | null;
    setSyncErrors: React.Dispatch<
        React.SetStateAction<OfflineSynchronizationErrors | null>
    >;
}

const SyncErrors = ({
    syncErrors,
    setSyncErrors,
}: SyncErrorProps): JSX.Element => {
    return (
        <>
            <PageHeader
                title={
                    'Errors encountered during uploading/sync after offline work'
                }
            />
            <CollapsibleCard cardTitle="Explanation">
                <p>
                    At least one of the changes made during offline could not be
                    synchronized with the online version. Any other changes on
                    the same punch/checklist has not been attempted.
                </p>
                <p>
                    Details describing the error(s) encountered is listed below.
                    Contact support for any questions regarding the error(s)
                </p>
            </CollapsibleCard>
            <Button
                onClick={(): void => {
                    localStorage.removeItem('SynchErrors');
                    setSyncErrors(null);
                }}
            >
                Delete errors
            </Button>
            {syncErrors ? (
                <div>
                    {syncErrors.CheckListErrors.length > 0 ? (
                        <div>
                            <h4>Checklists</h4>
                            {syncErrors.CheckListErrors.map((error) => (
                                <p key={error.Id}>{error.Id}</p>
                            ))}
                        </div>
                    ) : null}
                    {syncErrors.PunchListItemErrors.length > 0 ? (
                        <div>
                            <h4>Punches</h4>
                            {syncErrors.PunchListItemErrors.map((error) => (
                                <p key={error.Id}>{error.Id}</p>
                            ))}
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
