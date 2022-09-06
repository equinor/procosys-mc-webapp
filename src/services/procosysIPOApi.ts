import { AxiosInstance } from 'axios';
import { OutstandingIpos } from './apiTypes';

type ProcosysIPOApiServiceProps = {
    axios: AxiosInstance;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const procosysIPOApiService = ({ axios }: ProcosysIPOApiServiceProps) => {
    const getOutstandingIpos = async (
        plantId: string
    ): Promise<OutstandingIpos> => {
        const { data } = await axios.get(
            `Me/OutstandingIpos?plantId=PCS$${plantId}`
        );
        return data;
    };

    return {
        getOutstandingIpos,
    };
};

export type ProcosysIPOApiService = ReturnType<typeof procosysIPOApiService>;

export default procosysIPOApiService;
