import { IpoOrganization, IpoParticipant } from '../../../services/apiTypes';
import { IpoOrganizationsEnum } from '../../../typings/enums';
import useCommonHooks from '../../../utils/useCommonHooks';
import { useState } from 'react';

export interface RepresentativeAndResponse {
    representative: string;
    response: string;
}

const createOrganizationMap = (): Map<IpoOrganization, string> => {
    const orgMap = new Map<IpoOrganization, string>();
    orgMap.set(IpoOrganizationsEnum.Commissioning, 'Commissioning');
    orgMap.set(
        IpoOrganizationsEnum.ConstructionCompany,
        'Construction company'
    );
    orgMap.set(IpoOrganizationsEnum.Contractor, 'Contractor');
    orgMap.set(IpoOrganizationsEnum.Operation, 'Operation');
    orgMap.set(IpoOrganizationsEnum.TechnicalIntegrity, 'Technical integrity');
    orgMap.set(IpoOrganizationsEnum.Supplier, 'Supplier');
    orgMap.set(IpoOrganizationsEnum.External, 'Guest user (external)');
    return orgMap;
};

export const OrganizationMap = createOrganizationMap();

interface IUseViewIpoFacade {
    getRepresentativeAndResponse: (
        participant: IpoParticipant
    ) => RepresentativeAndResponse;
    getOrganizationText: (
        organization: IpoOrganization,
        sortKey: number
    ) => string | undefined;
    updateAttendedStatus: (
        attanded: boolean,
        rowVersion: string
    ) => Promise<void>;
    attended: boolean;
    updateNote: (rowVersion: string) => Promise<void>;
    note: string;
    setNote: React.Dispatch<React.SetStateAction<string>>;
    isLoading: boolean;
    completeIpo: (participant: IpoParticipant) => Promise<void>;
}

interface UseViewIpoFacadeProps {
    participant: IpoParticipant;
    setRefreshDetails: React.Dispatch<React.SetStateAction<boolean>>;
    setSnackbarText: React.Dispatch<React.SetStateAction<string>>;
    ipoRowVersion: string;
}

const useViewIpoFacade = ({
    participant,
    setRefreshDetails,
    setSnackbarText,
    ipoRowVersion,
}: UseViewIpoFacadeProps): IUseViewIpoFacade => {
    const { ipoApi, params } = useCommonHooks();
    const [attended, setAttended] = useState<boolean>(participant.attended);
    const [note, setNote] = useState<string>(participant.note);
    const [rowVersion, setRowVersion] = useState<string>(
        participant.rowVersion
    );
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getRepresentativeAndResponse = (
        participant: IpoParticipant
    ): RepresentativeAndResponse => {
        if (participant.person) {
            return {
                representative: `${participant.person.firstName} ${participant.person.lastName}`,
                response: participant.person.response ?? '-',
            };
        } else if (participant.functionalRole) {
            return {
                representative: participant.functionalRole.code,
                response: participant.functionalRole.response,
            };
        } else {
            return {
                representative: participant.externalEmail.externalEmail,
                response: participant.externalEmail.response,
            };
        }
    };

    const getOrganizationText = (
        organization: IpoOrganization,
        sortKey: number
    ): string | undefined => {
        let organizationText = OrganizationMap.get(organization);
        const organizationIsContractorOrConstructionCompany =
            organization === IpoOrganizationsEnum.Contractor ||
            organization === IpoOrganizationsEnum.ConstructionCompany;
        if (sortKey > 1 && organizationIsContractorOrConstructionCompany) {
            organizationText += ' additional';
        }
        return organizationText;
    };

    const updateAttendedStatus = async (attended: boolean): Promise<void> => {
        try {
            const newRowVersion = await ipoApi.putAttendedStatus(
                params.entityId,
                participant.id,
                attended,
                rowVersion
            );
            setRowVersion(newRowVersion);
            setAttended((prev) => !prev);
            setSnackbarText('Attended status updated');
        } catch (error) {
            if (!(error instanceof Error)) return;
            setSnackbarText(error.message);
        }
    };

    const updateNote = async (): Promise<void> => {
        try {
            const newRowVersion = await ipoApi.putNote(
                params.entityId,
                participant.id,
                note,
                rowVersion
            );
            setRowVersion(newRowVersion);
            setSnackbarText('Note updated');
        } catch (error) {
            if (!(error instanceof Error)) return;
            setSnackbarText(error.message);
        }
    };

    const completeIpo = async (participant: IpoParticipant): Promise<void> => {
        try {
            setIsLoading(true);
            const signer = participant.person
                ? participant.person
                : participant.functionalRole
                ? participant.functionalRole
                : undefined;

            if (!signer) {
                setIsLoading(false);
                return;
            }
            await ipoApi.putCompleteIpo(
                params.entityId,
                rowVersion,
                ipoRowVersion
            );
            setSnackbarText('Invitation completed');
            setRefreshDetails((prev) => !prev);
            setIsLoading(false);
        } catch (error) {
            if (!(error instanceof Error)) return;
            setSnackbarText(error.message);
        }
    };

    return {
        getRepresentativeAndResponse,
        getOrganizationText,
        updateAttendedStatus,
        attended,
        updateNote,
        note,
        setNote,
        isLoading,
        completeIpo,
    };
};

export default useViewIpoFacade;
