/**
 * Remove baseurl, including /api/.
 */
const removeBaseUrlFromUrl = (fullUrl: string): string => {
    return fullUrl.substring(
        fullUrl.indexOf('/api/') + 5, //todo: is there a better way?
        fullUrl.length
    );
};

export default removeBaseUrlFromUrl;
