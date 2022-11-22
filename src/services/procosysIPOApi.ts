import { AxiosInstance } from 'axios';
import { IpoDetails, OutstandingIposType } from './apiTypes';

type ProcosysIPOApiServiceProps = {
    axios: AxiosInstance;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const procosysIPOApiService = ({ axios }: ProcosysIPOApiServiceProps) => {
    const getOutstandingIpos = async (
        plantId: string
    ): Promise<OutstandingIposType> => {
        const { data } = await axios.get(
            `Me/OutstandingIpos?plantId=PCS$${plantId}`
        );
        return data;
    };

    const getIpoDetails = async (
        plantId: string,
        id: string
    ): Promise<IpoDetails> => {
        const { data } = await axios.get(
            `Invitations/${id}/?plantId=PCS$${plantId}`
        );
        return data;
    };

    return {
        getOutstandingIpos,
        getIpoDetails,
    };
};

export type ProcosysIPOApiService = ReturnType<typeof procosysIPOApiService>;

export default procosysIPOApiService;
