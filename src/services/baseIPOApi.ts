import { StorageKey } from '@equinor/procosys-webapp-components';
import axios, { AxiosInstance } from 'axios';
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
    const url = new URL(window.location.href);

    const retrievePlant = (url: URL) => {
        let plantInStorage = window.localStorage.getItem(StorageKey.PLANT);
        if (!plantInStorage) {
            const path = url.pathname;
            const segmentStartIndex = path.indexOf('/mc/');
            if (segmentStartIndex !== -1) {
                plantInStorage = path
                    .substring(segmentStartIndex + 4)
                    .split('/')[0];
                return plantInStorage;
            }
        }
        return plantInStorage;
    };

    const axiosInstance = axios.create();
    axiosInstance.defaults.baseURL = baseURL;
    axiosInstance.interceptors.request.use(async (request) => {
        try {
            const token = await authInstance.getAccessToken(scope);
            if (request.headers) {
                request.headers['Authorization'] = `Bearer ${token}`;
                if (plantInStorage !== 'undefined')
                    request.headers['x-plant'] = `PCS$${retrievePlant(url)}`;
            }
            return request;
        } catch (error) {
            const pcsError = error as Error;
            throw new Error(pcsError.message);
        }
    });
    axiosInstance.interceptors.response.use(
        (response) => {
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
