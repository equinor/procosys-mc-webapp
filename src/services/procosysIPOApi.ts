import { AxiosInstance } from 'axios';

type ProcosysIPOApiServiceProps = {
    axios: AxiosInstance;
};

type OutstandingIpos = {
    invitationId: number;
    description: string;
    organization: string;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const procosysIPOApiService = ({ axios }: ProcosysIPOApiServiceProps) => {
    const getOutstandingIpos = async (
        invitationId: number,
        description: string,
        organization: string
    ): Promise<OutstandingIpos> => {
        const { data } = await axios.get(`Me/OutstandingIpos`);
        return data;
    };

    return {
        getOutstandingIpos,
    };
};

export type ProcosysIPOApiService = ReturnType<typeof procosysIPOApiService>;

export default procosysIPOApiService;
