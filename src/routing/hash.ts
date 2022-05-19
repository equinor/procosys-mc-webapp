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
    let parameterString = '';
    parameterString += parameters?.forEach((params) => {
        parameterString += callback;
    });
    return parameterString;
    function callback(k: string, v: string, map: Map<string, string>): string {
        return k + v;
    }
};

export const HashCodeByHashConfiguration = (
    url: string,
    parameters: Map<string, string>
): number => {
    return HashGenerator(
        HashConfigurationByPath(url) + HashParameterConfiguration(parameters)
    );
};

export const HashCodeByHashHashConfigByUsingHttpRequestPayload = <T>(
    url: string,
    parameters: Map<string, string>,
    object: T
): number => {
    return HashGenerator(
        HashConfigurationByPath(url) + HashConfigByPayload<T>(object)
    );
};
