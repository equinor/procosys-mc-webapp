import { KeyValue } from './Http/HttpRequestMessageConfig';

export interface IHashGenerator {
    (source: string): number;
}

export const HashGenerator: IHashGenerator = (source: string): number => {
    let hash = 0,
        index,
        chr;
    for (index = 0; index < source.length; index++) {
        chr = source.charCodeAt(index);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

/**
 * Get all properties of an object.
 * Very useful when we doing hashing a the order of properties counts.
 */
class Describer {
    describeClass(typeOfClass: any) {
        const a = new typeOfClass();
        const array = Object.getOwnPropertyNames(a);
        return array;
    }
}

export const HashConfigByPayload = <T>(object: T): string => {
    const data = JSON.stringify(object);
    return data;
};

export const HashConfigurationByPath = (
    urlString: string | undefined
): string => {
    const path = urlString === undefined ? '' : urlString;
    return path;
};

export const HashParameterConfiguration = (
    parameters: Map<string, string> | undefined
): string => {
    if (parameters !== undefined) {
        const result = SortedMapAscending(parameters);
        return ToString(result);
    }
    throw new Error('parameters is undefined');
};

/**
 * Sort to map and return a sorted list over parameters with values as KeyValues
 * @param map
 * @returns
 */
export const SortedMapAscending = (
    map: Map<string, string> | undefined
): Array<KeyValue> => {
    const result = new Array<KeyValue>();
    if (map !== undefined) {
        for (const [key, value] of map) {
            result.push({ key, value });
        }
        result.sort((a, b) => a.key.localeCompare(b.key));
    }
    return result;
};

export const ToString = (sortedList: Array<KeyValue>): string => {
    let result = '';
    for (const item of sortedList) {
        result += `${item.key}=${item.value}&`;
    }
    return result;
};

/**
 * @summary Make a hash from the configuration object url and parameters
 * @param url
 * @param parameters
 * @returns
 */
export const HashCodeByHashConfiguration = (
    url: string,
    parameters: Map<string, string>
): number => {
    return HashGenerator(
        HashConfigurationByPath(url) + HashParameterConfiguration(parameters)
    );
};

export const URLSearchParamsToMap = (
    searchParams: URLSearchParams
): Map<string, string> => {
    const map = new Map<string, string>();
    const list = new Array<KeyValue>();
    //Convert to list of key value pairs
    for (const [key, value] of searchParams.entries()) {
        list.push({ key, value });
    }
    //Sort the list by key
    list.sort((a, b) => a.key.localeCompare(b.key));
    //Copy the sorted list to Map
    for (const item of list) {
        map.set(item.key, item.value);
    }
    return map;
};

/**
 * @summary Make a hash from the configuration object based on url and the payload
 * @param url
 * @param parameters
 * @param object
 * @returns
 */
export const HashCodeByUrlAndPayload = <T>(url: string, object: T): number => {
    return HashGenerator(
        HashConfigurationByPath(url) + HashConfigByPayload<T>(object)
    );
};

export const hashCodeByUrlAndPayload = (
    url: string,
    object: string
): number => {
    return HashGenerator(
        HashConfigurationByPath(url) + HashConfigByPayload(object)
    );
};
