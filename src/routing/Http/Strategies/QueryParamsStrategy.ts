import { IStrategy } from './IStrategy';
import BaseStrategy from './BaseStrategy';
import { HttpRequestMessageConfig } from '../HttpRequestMessageConfig';

/**
 * @Summary: For consistency we sort the httpRequestMessage parameters in ascending order
 * (if we dont do that, the function that generate the hash will not be consistent)
 * The strategy is to get the the parameters form the HttpRequestMessage object and then sort all the items in ascending order
 */
export class QueryParamsStrategy<T> implements IStrategy<T> {
    process<T>(config: HttpRequestMessageConfig<T>): T {
        const base = new BaseStrategy();
        // if (base.isString(data)) { }
        // if (base.isRecord(data)) {
        //     return data;
        //  }
        // if (base.isMap(config.data)) {
        //     return T;

        throw Error('Error processing the data');
    }
}
