import { TypeCandidates } from '../../../test/types';
import { MapAccedingSort } from '../../sort';
import BaseStrategy from './BaseStrategy';
import { IStrategy } from './IStrategy';

/**
 * @Summary: For consistency we sort the httpRequestMessage parameters in ascending order
 * (if we dont do that, the function that generate the hash will not be consistent)
 * The strategy is to get the the parameters form the HttpRequestMessage object and then sort all the items in ascending order
 */
export class QueryParamsStrategyWitAscendingSorting<T> implements IStrategy<T> {
    process<T = any>(data: TypeCandidates): TypeCandidates {
        // if (this.isString(data)) { }
        //if (this.isRecord(data)) { }
        const base = new BaseStrategy();
        if (base.isMap(data)) {
            return MapAccedingSort(data);
        }

        throw Error();
    }
}
