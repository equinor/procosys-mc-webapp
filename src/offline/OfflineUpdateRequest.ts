import removeBaseUrlFromUrl from '../utils/removeBaseUrlFromUrl';

export class OfflineUpdateRequest {
    //seqno: number;
    url: string;
    method: string;
    bodyData: any;
    additionalHeaders: any;

    constructor(
        url: string,
        method: string,
        bodyData: any,
        additionalHeaders: any
    ) {
        this.url = url;
        this.method = method;
        this.bodyData = bodyData;
        this.additionalHeaders = additionalHeaders;
    }

    static async build(request: Request): Promise<OfflineUpdateRequest> {
        const headers = request.headers;
        const contentType = headers.get('Content-Type');
        const additionalHeaders = { 'Content-Type': contentType };

        let bodyData;
        if (
            request.body &&
            (contentType == undefined || contentType.includes('json'))
        ) {
            bodyData = await request.json();
        } else {
            bodyData = await request.formData(); //attachment
        }

        const url = removeBaseUrlFromUrl(request.url);

        return new OfflineUpdateRequest(
            url,
            request.method,
            bodyData,
            additionalHeaders
        );
    }
}
