import { IpoOrganization, IpoParticipant } from '../../../services/apiTypes';

export interface RepresentativeAndResponse {
    representative: string;
    response: string;
}

export enum IpoOrganizationsEnum {
    Commissioning = 'Commissioning',
    ConstructionCompany = 'ConstructionCompany',
    Contractor = 'Contractor',
    Operation = 'Operation',
    TechnicalIntegrity = 'TechnicalIntegrity',
    Supplier = 'Supplier',
    External = 'External',
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
}

const useViewIpoFacade = (): IUseViewIpoFacade => {
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

    return { getRepresentativeAndResponse, getOrganizationText };
};

export default useViewIpoFacade;
