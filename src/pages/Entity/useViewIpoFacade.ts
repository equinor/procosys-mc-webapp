import { IpoParticipant } from '../../services/apiTypes';

export interface RepresentativeAndResponse {
    representative: string;
    response: string;
}

interface IUseViewIpoFacade {
    getRepresentativeAndResponse: (
        participant: IpoParticipant
    ) => RepresentativeAndResponse;
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
    return { getRepresentativeAndResponse };
};

export default useViewIpoFacade;
