import { AxiosRequestConfig, Method } from 'axios';

export class KeyValue {
    key = '';
    value = '';
}
export class HttpRequestMessageConfig<D = any> {
    readonly method?: string;
    readonly url?: string | undefined;
    readonly baseURL?: string | undefined;
    readonly data?: D;
    readonly params?: Map<string, string>;
    readonly paramsArray: Array<KeyValue> = [];
    readonly headers: Record<string, string> = {};
    readonly headersArray: Array<KeyValue> = [];
    readonly responseType?: string;

    constructor(axiosConfig: AxiosRequestConfig<D>) {
        this.method = axiosConfig.method;
        this.url = axiosConfig.url;
        this.baseURL = axiosConfig.baseURL;

        if (axiosConfig?.headers !== undefined) {
            for (const [key, value] of Object.entries(axiosConfig.headers)) {
                this.headers[key] = value;
                this.headersArray.push({ key, value });
            }
            this.headersArray.sort();
        }

        if (axiosConfig.params !== undefined) {
            this.params = new Map<string, string>();
            for (const [key, value] of Object.entries(axiosConfig.params)) {
                const theValue: string = value as string;
                this.params?.set(key, theValue);
                this.paramsArray.push({ key, value: theValue });
            }

            this.paramsArray.sort();
        }

        if (axiosConfig.data !== undefined) {
            this.data = axiosConfig.data;
        }
    }
}
