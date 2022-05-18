import { HttpRequestMessageConfig } from "../HttpRequestMessageConfig";

export interface IStrategy<T> {
    process<T>(config: HttpRequestMessageConfig<T>): T;
}
