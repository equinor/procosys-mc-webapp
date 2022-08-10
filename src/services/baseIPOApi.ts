import { StorageKey } from '@equinor/procosys-webapp-components';
import axios, { AxiosInstance } from 'axios';
import objectToCamelCase from '../utils/objectToCamelCase';
import { IAuthService } from './authService';

type baseIPOApiProps = {
    authInstance: IAuthService;
    baseURL: string;
    scope: string[];
};

const baseIPOApiService = ({
    authInstance,
    baseURL,
    scope,
}: baseIPOApiProps): AxiosInstance => {
    const plantInStorage = window.localStorage.getItem(StorageKey.PLANT);
    const axiosInstance = axios.create();
    axiosInstance.defaults.baseURL = baseURL;
    axiosInstance.interceptors.request.use(async (request) => {
        try {
            const token = await authInstance.getAccessToken(scope);
            if (request.headers) {
                request.headers['Authorization'] = `Bearer ${token}`;
                if (plantInStorage !== 'undefined')
                    request.headers['x-plant'] = `PCS$${plantInStorage}`;
            }
            return request;
        } catch (error) {
            const pcsError = error as Error;
            throw new Error(pcsError.message);
        }
    });
    axiosInstance.interceptors.response.use(
        (response) => {
            if (
                typeof response.data === 'object' &&
                !(response.data instanceof Blob)
            ) {
                response.data = objectToCamelCase(response.data);
            }
            return response;
        },
        (error) => {
            if (axios.isCancel(error)) {
                throw error;
            }
            if (error.response) {
                throw new Error(error.response.data);
            } else {
                throw new Error(error.message);
            }
        }
    );
    return axiosInstance;
};

export default baseIPOApiService;
