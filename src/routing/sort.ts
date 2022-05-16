/* eslint-disable prettier/prettier */

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



export function MapAccedingSort(map: Map<string, string>) : Map<string, string> {

    let newman = new Map<string, string>();
    newman.set("name1", "asc");
    newman.set("name2", "asc");

    const sortedMap : Map<string, string> = new Map([...newman.entries()].sort());   
    return sortedMap;
};
