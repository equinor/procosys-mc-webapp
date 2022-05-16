/* eslint-disable prettier/prettier */
import { IHttpRequestMessage } from "../test/httpRequestResponseMessage";
import { IPropertyStrategy } from "../test/IPropertyStrategy";
import { MapAccedingSort } from './sort';


interface IHashGenerator {
    (source: string): number;
};

export const HashGenerator : IHashGenerator = (source: string): number => {
    let hash = 0, index, chr;
    for (index = 0; index < source.length; index++) {
        chr = source.charCodeAt(index);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
 
/**
 * @summary: Returns a hash of the given http path (e.g. https://api.data.gov/some/path with a map (propertyname and value) of arguments )
 * @param routePath 
 * @param propertiesNamesAndValues 
 * @returns 
 */
export function HashHttpRequest<T>(request: IHttpRequestMessage<T>, 
                            hashGenerator: IHashGenerator, 
                            propertyStrategy: IPropertyStrategy<T>): number {

    const parameters = request?.GetHttpRequestParameters();
    const resultMapSort = MapAccedingSort(parameters);
    let propertiesWithValues = '';
    resultMapSort.forEach((value, key) => {
        propertiesWithValues += key + ':' + value + '';
    });

    const source = request.GetPath() + propertiesWithValues;
    const hash = hashGenerator(source);

    return hash;
}
