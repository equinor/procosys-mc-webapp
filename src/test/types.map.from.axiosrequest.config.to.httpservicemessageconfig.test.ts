import { AxiosRequestConfig } from "axios";
import { Person } from "../services/apiTypes";
import { getProperty, HttpServiceMessageRawConfig } from "./types";
describe("Property and Value copy with Pick<> feature", () => {
    const parameterBuilder = new URLSearchParams();
    parameterBuilder.set('test1', 'value1');
    parameterBuilder.set('test2', 'value2');
    parameterBuilder.set('test3', 'value3');

    const headers: Record<string, string> = {
        miffy1: '12',
        miffy2: '22',
        miffy3: '36',
    }
    const config: AxiosRequestConfig = {
        url: "/person/100",
        method: "GET",
        baseURL: "http://localhost",
        data: {
            id: 100,
            azureOid: '',
            username: '',
            firstName: '',
            lastName: '',
            email: '',
        },
        params: parameterBuilder,
        headers: headers
    };

    const clone: HttpServiceMessageRawConfig<Person> = {
        method: getProperty(config, 'method'),
        url: getProperty(config, 'url'),
        baseURL: getProperty(config, 'baseURL'),
        data: getProperty(config, 'data'),
        params: getProperty(config, 'params'),
        headers: getProperty(config, 'headers'),
        responseType: getProperty(config, 'responseType'),
    };

    it("should copy the url", () => {
        expect(clone.url).toBe('/person/100');
    });

    it("should copy the method", () => {
        expect(clone.method).toBe('GET');
    });

    it("should copy the baseURL", () => {
        expect(clone.baseURL).toBe('http://localhost');
    });

    it("should copy the data property and value", () => {
        expect(clone.data?.id).toBe(100);
    });

    it("should copy the params property and value", () => {
        expect(Array.from(clone.params).length).toBe(Array.from(parameterBuilder).length);
    });

    it("should have a header collection with the same length as source data", () => {
        expect(clone.headers?.length).toBe(headers.length);
    });

});