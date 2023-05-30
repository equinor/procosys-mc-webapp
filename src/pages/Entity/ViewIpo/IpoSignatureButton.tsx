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
}

const IpoSignatureButton = ({
    ipoStatus,
    participant,
    isLoading,
    completeIpo,
    uncompleteIpo,
}: IpoSignButtonProps): JSX.Element => {
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
                //} else {
                //         if (
                //             (participant.isSigner || isUsingAdminRights) &&
                //             participant.signedBy
                //         ) {
                //             return getUnsignButton();
                //         } else if (
                //             participant.isSigner &&
                //             status !== IpoStatusEnum.CANCELED
                //         ) {
                //             return getSignButton();
                //         }
                //     }
                //     break;
                // case OrganizationsEnum.ConstructionCompany:
                //     if (participant.sortKey === 1) {
                //         if (
                //             (participant.isSigner || isUsingAdminRights) &&
                //             status === IpoStatusEnum.ACCEPTED
                //         ) {
                //             return (
                //                 <SignatureButton
                //                     name={'Unaccept punch-out'}
                //                     onClick={(): Promise<void> =>
                //                         handleButtonClick(async (): Promise<any> => {
                //                             return await unaccept(participant);
                //                         })
                //                     }
                //                     disabled={loading}
                //                 />
                //             );
                //         } else if (
                //             participant.isSigner &&
                //             status === IpoStatusEnum.COMPLETED
                //         ) {
                //             return (
                //                 <SignatureButtonWithTooltip
                //                     name={'Accept punch-out'}
                //                     tooltip={tooltipAccept}
                //                     onClick={(): Promise<void> =>
                //                         handleButtonClick(async (): Promise<any> => {
                //                             return await accept(participant);
                //                         })
                //                     }
                //                     disabled={loading}
                //                 />
                //             );
                //         }
                //     } else {
                //         if (
                //             (participant.isSigner || isUsingAdminRights) &&
                //             participant.signedBy
                //         ) {
                //             return getUnsignButton();
                //         } else if (participant.isSigner) {
                //             return getSignButton();
                //         }
                //     }
                //     break;
                // case OrganizationsEnum.Operation:
                // case OrganizationsEnum.TechnicalIntegrity:
                // case OrganizationsEnum.Commissioning:
                //     if (
                //         (participant.isSigner || isUsingAdminRights) &&
                //         participant.signedBy
                //     ) {
                //         return getUnsignButton();
                //     } else if (participant.isSigner) {
                //         return getSignButton();
                //     }
            }
    }

    return <span>-</span>;
};

export default IpoSignatureButton;
