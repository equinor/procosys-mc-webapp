import { AxiosInstance } from 'axios';

type ProcosysIPOApiServiceProps = {
    axios: AxiosInstance;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const procosysIPOApiService = ({ axios }: ProcosysIPOApiServiceProps) => {
    const isAlive = async (): Promise<any[]> => {
        const { data } = await axios.get(`Heartbeat/IsAlive`);
        return data;
    };

    return {
        isAlive,
    };
};

export type ProcosysIPOApiService = ReturnType<typeof procosysIPOApiService>;

export default procosysIPOApiService;
