import { TypeCandidates } from '../../../test/types';

export interface IStrategy<T = any> {
    process<T = any>(data: TypeCandidates): TypeCandidates;
}
