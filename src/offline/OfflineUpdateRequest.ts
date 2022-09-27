import removeBaseUrlFromUrl from '../utils/removeBaseUrlFromUrl';

export enum RequestType {
    Json = 'json',
    Attachment = 'attachment',
}
export class OfflineUpdateRequest {
    //seqno: number;
    url: string;
    method: string;
    bodyData: any;
    type: RequestType;

    constructor(url: string, method: string, bodyData: any, type: any) {
        this.url = url;
        this.method = method;
        this.bodyData = bodyData;
        this.type = type;
    }

    static async build(request: Request): Promise<OfflineUpdateRequest> {
        const headers = request.headers;
        const contentType = headers.get('Content-Type');

        let bodyData;
        let type;

        if (
            request.body &&
            (contentType == undefined || contentType.includes('json'))
        ) {
            bodyData = await request.json();
            type = RequestType.Json;
        } else {
            bodyData = await request.formData(); //attachment
            type = RequestType.Attachment;
        }

        const url = removeBaseUrlFromUrl(request.url);

        return new OfflineUpdateRequest(url, request.method, bodyData, type);
    }
}
