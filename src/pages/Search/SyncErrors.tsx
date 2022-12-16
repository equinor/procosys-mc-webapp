import { Button } from '@equinor/eds-core-react';
import {
    CollapsibleCard,
    EntityDetails,
    InfoItem,
    PageHeader,
} from '@equinor/procosys-webapp-components';
import React from 'react';
import styled from 'styled-components';
import EdsIcon from '../../components/icons/EdsIcon';
import { OfflineSynchronizationErrors } from '../../services/apiTypes';
import { COLORS } from '../../style/GlobalStyles';

const ErrorsWrapper = styled.div`
    margin: -16px 0 66px 0;
`;
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
            <CollapsibleCard cardTitle="Error Information">
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
