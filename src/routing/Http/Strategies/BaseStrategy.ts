import { MapKVString, TypeCandidates } from '../../../test/types';
import { IStrategy } from './IStrategy';

export default class BaseStrategy<T> {
    isMap(
        map: Map<string, string> | Record<string, string> | string
    ): map is Map<string, string> {
        return (map as Map<string, string>).get !== undefined;
    }

    isRecord(
        isRecord: Map<string, string> | Record<string, string> | string
    ): isRecord is Record<string, string> {
        return (isRecord as Record<string, string>).set !== undefined;
    }

    isString(
        string: Map<string, string> | Record<string, string> | string
    ): string is string {
        return (string as string).length !== undefined;
    }
}
