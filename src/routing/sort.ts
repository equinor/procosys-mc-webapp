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

export function sortMap(map: Map<string, string>) : Map<string, string> {
    const sortedMap = new Map([...map].sort());
    return sortedMap;
};
