import { HttpRequestMessageConfig } from '../HttpRequestMessageConfig';
import { IStrategy } from './IStrategy';

/**
 * @Summary: For consistency we sort the httpRequestMessage parameters in ascending order
 * (if we dont do that, the function that generate the hash will not be consistent)
 * The strategy is to get the the parameters form the HttpRequestMessage object and then sort all the items in ascending order
 */
export class QueryParamsStrategyWitAscendingSorting<T> implements IStrategy<T> {
    process<T>(config: HttpRequestMessageConfig<T>): T {
        throw new Error('Method not implemented.');
    }
}
