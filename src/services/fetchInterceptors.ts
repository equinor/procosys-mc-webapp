import { objectToCamelCase } from '@equinor/procosys-webapp-components';
import fetchIntercept, { FetchInterceptorResponse } from 'fetch-intercept';
import { IAuthService } from './authService';

type baseApiProps = {
    authInstance: IAuthService;
    baseURL: string;
    scope: string[];
};

export const fetchInterceptors = (): void => {
    const unregister = fetchIntercept.register({
        request: async (url, config) => {
            // try {
            //     const token = await authInstance.getAccessToken(scope);
            //     if (config.headers) {
            //         config.headers['Authorization'] = `Bearer ${token}`;
            //     }
            //     return [url, config];
            // } catch (error) {
            //     const pcsError = error as Error;
            //     throw new Error(pcsError.message);
            // }
            return [url, config];
        },

        requestError: (error) => {
            // Called when an error occured during another 'request' interceptor call
            return Promise.reject(error);
        },

        response: (
            response: FetchInterceptorResponse
        ): FetchInterceptorResponse => {
            if (
                typeof response.type === 'object' &&
                !(response.body instanceof Blob)
            ) {
                console.log('intercepted response: ', response);
                const camelCasedResponse = objectToCamelCase(response);
            }
            return response;
        },

        responseError: (error) => {
            // Handle an fetch error
            return Promise.reject(error);
        },
    });
    unregister();
};
