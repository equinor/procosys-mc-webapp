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

        const url = removeBaseUrlFromUrl(request.url);

        let bodyData;
        let type;

        if (request.body) {
            if (contentType == undefined || contentType.includes('json')) {
                //json
                bodyData = await request.json();
                type = RequestType.Json;
            } else if (contentType.includes('form-data')) {
                //attachment
                const formData = await request.formData();
                bodyData = [];
                formData.forEach((element) => bodyData.push(element));
                type = RequestType.Attachment;
            } else {
                console.error(
                    `Not able to add body data with ContentType ${contentType} when building request object for ${url}`
                );
            }
        }

        return new OfflineUpdateRequest(url, request.method, bodyData, type);
    }
}
