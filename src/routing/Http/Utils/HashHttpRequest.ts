import { IHttpRequestMessage } from '../HttpRequestMessage';
import { MapAccedingSort } from '../../sort';
import { IHashGenerator } from '../../hash';
import { IStrategy } from '../Strategies/IStrategy';
import { QueryParamsToOneSingleLineStrategy } from '../Strategies/QueryParamsToOneSingleLineStrategy';
import { HttpRequestMessageConfig } from '../HttpRequestMessageConfig';

/**
 * @summary: Returns a hash of the given http path (e.g. https://api.data.gov/some/path with a map (propertyname and value) of arguments )
 * @param routePath
 * @param propertiesNamesAndValues
 * @returns
 */
export function HashHttpRequest<T>(
    request: IHttpRequestMessage<T>,
    hashGenerator: IHashGenerator,
    queryParamsToOneSingleLineStrategy: QueryParamsToOneSingleLineStrategy<T>,
    config: HttpRequestMessageConfig<T>
): number {
    const parameters = request.GetHttpRequestParameters();
    if (parameters === undefined) {
        throw Error('Error reading data from configuration');
    }
    const resultMapSort = MapAccedingSort(parameters);
    if (resultMapSort !== undefined) {
        const result = queryParamsToOneSingleLineStrategy.process(config);
        const hash = hashGenerator(request.GetPath() + result);

        return hash;
    }
    throw new Error('Type Error');
}
