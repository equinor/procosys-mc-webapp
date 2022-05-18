import { HttpRequestMessageConfig } from '../HttpRequestMessageConfig';

/**
 * @Summary: For consistency we sort the httpRequestMessage parameters in ascending order
 * (if we dont do that, the function that generate the hash will not be consistent)
 * The strategy is to get the the parameters form the HttpRequestMessage object and then sort all the items in ascending order
 */
export class QueryParamsToOneSingleLineStrategy<T> {
    process(config: HttpRequestMessageConfig<T>): string {
        let propertiesWithValues = '';
        config?.params?.forEach((value, key) => {
            propertiesWithValues += key + ':' + value + '';
        });

        return propertiesWithValues;
    }
}
