import React from 'react';
import { IpoOrganizationsEnum, IpoStatusEnum } from '../../../typings/enums';
import { IpoParticipant } from '../../../services/apiTypes';
import { Button } from '@equinor/eds-core-react';

interface IpoSignButtonProps {
    ipoStatus: IpoStatusEnum;
    participant: IpoParticipant;
    isLoading: boolean;
    completeIpo: () => Promise<void>;
    uncompleteIpo: () => Promise<void>;
    signIpo: () => Promise<void>;
    unsignIpo: () => Promise<void>;
}

const IpoSignatureButton = ({
    ipoStatus,
    participant,
    isLoading,
    completeIpo,
    uncompleteIpo,
    signIpo,
    unsignIpo,
}: IpoSignButtonProps): JSX.Element => {
    const getSignButton = (): JSX.Element => {
        return (
            <Button
                name={'Sign'}
                onClick={async (): Promise<void> => {
                    await signIpo();
                }}
                disabled={isLoading}
            >
                Sign
            </Button>
        );
    };

    const getUnsignButton = (): JSX.Element => {
        return (
            <Button
                name={'Unsign'}
                onClick={async (): Promise<void> => {
                    await unsignIpo();
                }}
                disabled={isLoading}
            >
                Unsign
            </Button>
        );
    };

    if (ipoStatus === IpoStatusEnum.CANCELED) return <></>;
    switch (participant.organization) {
        case IpoOrganizationsEnum.Contractor:
            if (participant.sortKey === 0) {
                if (
                    participant.isSigner &&
                    ipoStatus === IpoStatusEnum.PLANNED
                ) {
                    return (
                        <Button
                            name={'Complete punch-out'}
                            onClick={async (): Promise<void> => {
                                await completeIpo();
                            }}
                            disabled={isLoading}
                        >
                            Complete
                        </Button>
                    );
                } else if (
                    participant.isSigner &&
                    ipoStatus === IpoStatusEnum.COMPLETED
                ) {
                    return (
                        <Button
                            name={'Uncomplete'}
                            onClick={async (): Promise<void> => {
                                await uncompleteIpo();
                            }}
                            disabled={isLoading}
                        >
                            Uncomplete
                        </Button>
                    );
                }
            } else {
                if (participant.isSigner && participant.signedBy) {
                    return getUnsignButton();
                } else if (participant.isSigner) {
                    return getSignButton();
                }
            }
            break;
        case IpoOrganizationsEnum.ConstructionCompany:
            if (participant.sortKey === 1) {
                if (
                    participant.isSigner &&
                    ipoStatus === IpoStatusEnum.ACCEPTED
                ) {
                    return (
                        <SignatureButton
                            name={'Unaccept punch-out'}
                            onClick={(): Promise<void> =>
                                handleButtonClick(async (): Promise<any> => {
                                    return await unaccept(participant);
                                })
                            }
                            disabled={isLoading}
                        />
                    );
                } else if (
                    participant.isSigner &&
                    status === IpoStatusEnum.COMPLETED
                ) {
                    return (
                        <SignatureButtonWithTooltip
                            name={'Accept punch-out'}
                            tooltip={tooltipAccept}
                            onClick={(): Promise<void> =>
                                handleButtonClick(async (): Promise<any> => {
                                    return await accept(participant);
                                })
                            }
                            disabled={isLoading}
                        />
                    );
                }
            } else {
                if (participant.isSigner && participant.signedBy) {
                    return getUnsignButton();
                } else if (participant.isSigner) {
                    return getSignButton();
                }
            }
            break;
        case IpoOrganizationsEnum.Operation:
        case IpoOrganizationsEnum.TechnicalIntegrity:
        case IpoOrganizationsEnum.Commissioning:
            if (participant.isSigner && participant.signedBy) {
                return getUnsignButton();
            } else if (participant.isSigner) {
                return getSignButton();
            }
    }

    return <span>-</span>;
};

export default IpoSignatureButton;
