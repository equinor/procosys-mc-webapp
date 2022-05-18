import { MapKVString, TypeCandidates } from '../../../test/types';
import { IStrategy } from './IStrategy';

export default class BaseStrategy<T> {
    isMap(map: TypeCandidates): map is Map<string, string> {
        return (map as Map<string, string>).get !== undefined;
    }

    isRecord(isRecord: TypeCandidates): isRecord is Record<string, string> {
        return (isRecord as Record<string, string>).set !== undefined;
    }

    isString(str: TypeCandidates | T): str is string {
        return (str as string).length !== undefined;
    }
}
