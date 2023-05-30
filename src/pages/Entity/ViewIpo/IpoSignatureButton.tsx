import React from 'react';
import { IpoOrganizationsEnum, IpoStatusEnum } from '../../../typings/enums';
import { IpoParticipant } from '../../../services/apiTypes';
import { Button } from '@equinor/eds-core-react';

interface IpoSignButtonProps {
    ipoStatus: IpoStatusEnum;
    participant: IpoParticipant;
    isLoading: boolean;
    completeIpo: (participant: IpoParticipant) => Promise<void>;
}

const IpoSignatureButton = ({
    ipoStatus,
    participant,
    isLoading,
    completeIpo,
}: IpoSignButtonProps): JSX.Element => {
    if (ipoStatus === IpoStatusEnum.CANCELED) return <></>;
    console.log(ipoStatus);
    console.log(participant.isSigner);
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
                                await completeIpo(participant);
                            }}
                            disabled={isLoading}
                        >
                            Complete
                        </Button>
                    );
                } //else if (
                //             (participant.isSigner || isUsingAdminRights) &&
                //             status === IpoStatusEnum.COMPLETED
                //         ) {
                //             return (
                //                 <SignatureButton
                //                     name={'Uncomplete'}
                //                     onClick={(): Promise<void> =>
                //                         handleButtonClick(async (): Promise<any> => {
                //                             return await uncomplete(participant);
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
