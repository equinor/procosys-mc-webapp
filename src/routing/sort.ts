/* eslint-disable prettier/prettier */

import { MapKVString, TypeCandidates } from "../test/types";

/**
 * 
 * @param args - List of values as string 
 * @returns - List of sorted values 
 */
export function sort(args: string[]): string[] {
    const sortedArgs = args.sort((n1, n2) => {
        if (n1 > n2) {
            return 1;
        }
        if (n1 < n2) {
            return -1;
        }
        return 0;
    });
    return sortedArgs;
}



export function MapAccedingSort(map: Map<string, string> ): Map<string, string>  {


    console.log(map);
    console.log(map);
    console.log(map);console.log(map);
    let newman = new Map<string, string>();
    newman.set("name1", "asc");
    newman.set("name2", "asc");

    const sortedMap : Map<string, string> = new Map([...newman].sort());   
    return sortedMap;
};
