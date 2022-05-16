import { AxiosRequestConfig } from "axios";
import { Person } from "../services/apiTypes";
import { getProperty, HttpRequestMessageConfig, ReplaceAxiosParams, ReplaceAxisHeaders } from "./types";

describe("Transform a type's properties with other types", () => {
    const parameterBuilder = new URLSearchParams();
    parameterBuilder.set('test1', 'value1');
    parameterBuilder.set('test2', 'value2');
    parameterBuilder.set('test3', 'value3');

    const headers: Record<string, string> = {
        miffy1: '12',
        miffy2: '22',
        miffy3: '36',
    }
    const config: AxiosRequestConfig<Person> = {
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
    it("should discover that headers have change type", () => {
        let transformed: ReplaceAxisHeaders<HttpRequestMessageConfig<Person>> = {
            headers: getProperty(config, 'headers'),
        };
        expect(transformed.headers).toBe(headers);
    });

    it("should discover that param have change type", () => {
        let transformed: ReplaceAxiosParams<HttpRequestMessageConfig<Person>> = {
            params: getProperty(config, 'params'),
        };    
        expect(transformed.params).toBe(parameterBuilder);
    });    
});