import { IHttpRequestMessage } from './httpRequestResponseMessage';
import { MapAccedingSort as AccedingSortingOnMap } from '../routing/sort';

export interface IPropertyStrategy<T> {
    DoSomethingWithTheParameters<T>(
        map: Map<string, string>
    ): Map<string, string>;
}

/**
 * @Summary: For consistency we sort the httpRequestMessage parameters in ascending order 
 * (if we dont do that, the function that generate the hash will not be consistent)
 * The strategy is to get the the parameters form the HttpRequestMessage object and then sort all the items in ascending order
 */
export class PropertyAccSortingStrategy<T> implements IPropertyStrategy<T>
{
    DoSomethingWithTheParameters<T>(
        map: Map<string, string>): Map<string, string> {
        const resultMapSort = AccedingSortingOnMap(map);
        return resultMapSort;
    }
}
