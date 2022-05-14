/* eslint-disable prettier/prettier */
import { sort, sortMap } from './sort';

/**
 * @summary: Returns a hash of the given http path (e.g. https://api.data.gov/some/path with a list of arguments)
 */
export default function hashGenerator1(
    routePath: string,
    args: Array<string>
): number {
    const pathWithSortedArgs = routePath + sort(args).join('');
    console.log('Test:' + pathWithSortedArgs);
    let hash = 0;
    for (let index = 0; index < pathWithSortedArgs.length; index++) {
        hash = 31 * hash + pathWithSortedArgs.charCodeAt(index);
    }
    return hash & 0xffffffff;
}

/**
 * 
 * @param routePath - The path to the API
 * @param args - The route arguments
 * @returns the hash of the given http path (e.g. https://api.data.gov/some/path with a list of arguments)
 */
export function hashGenerator2(routePath: string, args: Array<string>): number {
    const pathWithSortedArgs = routePath + sort(args).join('');
    let hash = 0,
        index,
        chr;
    if (pathWithSortedArgs.length === 0) return hash;
    for (index = 0; index < pathWithSortedArgs.length; index++) {
        chr = pathWithSortedArgs.charCodeAt(index);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

export function hashGenerator3(routePath: string, propertiesNamesAndValues: Map<string,string>): number {
  const resultMapSort = sortMap(propertiesNamesAndValues);
  let propertiesWithValues = '';
  resultMapSort.forEach((value, key) => {
    propertiesWithValues += key + ':' + value + '';
  });
  
  const pathWithSortedArgs = routePath + propertiesWithValues;
  let hash = 0,
      index,
      chr;
  if (pathWithSortedArgs.length === 0) return hash;
  for (index = 0; index < pathWithSortedArgs.length; index++) {
      chr = pathWithSortedArgs.charCodeAt(index);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
  }
  return hash;
}