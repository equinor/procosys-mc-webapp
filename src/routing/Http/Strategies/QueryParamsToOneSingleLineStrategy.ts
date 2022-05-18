import { config } from '../../../test/httpRequestMessage.testdata';

import { TypeCandidates } from '../../../test/types';
import BaseStrategy from './BaseStrategy';

/**
 * @Summary: For consistency we sort the httpRequestMessage parameters in ascending order
 * (if we dont do that, the function that generate the hash will not be consistent)
 * The strategy is to get the the parameters form the HttpRequestMessage object and then sort all the items in ascending order
 */
export class QueryParamsToOneSingleLineStrategy<T> extends BaseStrategy<T> {
    process<T = any>(data: TypeCandidates): TypeCandidates {
        // if (this.isString(data)) { }
        // if (this.isRecord(data)) {
        //     return data;
        //  }
        if (this.isMap(data)) { 
            let propertiesWithValues = '';
            data.forEach((value, key) => {
                propertiesWithValues += key + ':' + value + '';
            });
            return propertiesWithValues;
        }

        throw Error("Something bad happened inside the strategy");
        
    };
};