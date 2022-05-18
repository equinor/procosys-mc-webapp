import { HttpRequestMessageConfig, TypeCandidates } from '../../../test/types';

export interface IStrategy<T> {
    process<T>(config: HttpRequestMessageConfig<T>): T;
}
