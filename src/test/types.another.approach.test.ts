import { AxiosRequestConfig } from "axios";
import { Person } from "../services/apiTypes";
import { HttpRequestMessage } from "./httpRequestResponseMessage";
import { MyPick } from "./types";

 



describe("Property and Value copy with Pick<> feature", () =>{
    it("should copy", () => {
        
        const config = <T>() : AxiosRequestConfig<T> => {    
            return {
                url: "http://localhost",
                method: "GET",
                baseURL: "http://localhost"

            }
        };
        type ClonedAxiosConfig = MyPick<AxiosRequestConfig, "url"|"method"|"baseURL">
        const foo : ClonedAxiosConfig = { ...config };
        
        expect(config<Person>().url).toBe("http://localhost");
        expect(foo.url).toBe("http://localhost");

    });
});