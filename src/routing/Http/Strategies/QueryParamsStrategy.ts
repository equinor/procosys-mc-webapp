import { TypeCandidates } from '../../../test/types';
import BaseStrategy from './BaseStrategy';

/**
 * @Summary: For consistency we sort the httpRequestMessage parameters in ascending order
 * (if we dont do that, the function that generate the hash will not be consistent)
 * The strategy is to get the the parameters form the HttpRequestMessage object and then sort all the items in ascending order
 */
export class QueryParamsStrategy<T> extends BaseStrategy<T> {
    process<T = any>(data: TypeCandidates): Map<string, string> {
        // if (this.isString(data)) { }
        // if (this.isRecord(data)) {
        //     return data;
        //  }
        if (this.isMap(data)) {
            return data;
        }

        throw Error('Error processing the data');
    }
}
