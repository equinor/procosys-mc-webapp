import { HttpRequestMessageConfig, TypeCandidates } from '../../../test/types';
import BaseStrategy from './BaseStrategy';
import { IStrategy } from './IStrategy';

/**
 * @Summary: For consistency we sort the httpRequestMessage parameters in ascending order
 * (if we dont do that, the function that generate the hash will not be consistent)
 * The strategy is to get the the parameters form the HttpRequestMessage object and then sort all the items in ascending order
 */
export default class ProcessBodyStrategy<T> implements IStrategy<T> {
    process<T>(config: HttpRequestMessageConfig<T>): T {
        const base = new BaseStrategy();
        if (base.isString(config.data)) {
            const result = JSON.parse(config.data);
            console.log('Then serialisation process produced this: ', result);
            return JSON.parse(result);
        }
        throw Error('InvalidSomething is wrong with the data');
        // if (this.isRecord(data)) { }
        // if (this.isMap(data)) { }
    }

    // isString(str: TypeCandidates | T): str is string {
    //     return (str as string).length !== undefined;
    // }
}
