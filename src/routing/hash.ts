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
