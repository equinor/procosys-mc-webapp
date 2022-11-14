import generateUniqueId from '../utils/generateUniqueId';
import removeBaseUrlFromUrl from '../utils/removeBaseUrlFromUrl';

export enum RequestType {
    Json = 'json',
    Attachment = 'attachment',
}
export class OfflineUpdateRequest {
    uniqueId: string;
    url: string;
    method: string;
    bodyData: any;
    blob?: ArrayBuffer; //attachment object for offline content db
    type: RequestType;
    entityid: number | null;
    timestamp: number;
    responseIsNewEntityId = false;
    syncronized = false;

    constructor(
        url: string,
        method: string,
        bodyData: any,
        type: any,
        entityid: number | null,
        timestamp: number,
        blob?: ArrayBuffer
    ) {
        this.uniqueId = generateUniqueId();
        this.url = url;
        this.method = method;
        this.bodyData = bodyData;
        this.type = type;
        this.entityid = entityid;
        this.timestamp = timestamp;
        this.blob = blob;
    }

    /**
     * Build an object for storing all necessary information about the update request.
     */
    static async buildOfflineRequestObject(
        request: Request
    ): Promise<OfflineUpdateRequest> {
        const headers = request.headers;
        const contentType = headers.get('Content-Type');

        const url = removeBaseUrlFromUrl(request.url);

        let bodyData;
        let blob;
        let type;

        if (request.body) {
            if (contentType == undefined || contentType.includes('json')) {
                //json

                bodyData = await request.json();
                type = RequestType.Json;
            } else if (contentType.includes('form-data')) {
                //attachment
                const formData = await request.formData();

                const tempData = new Map();
                let arrayBuffer;
                for (const [key, value] of formData) {
                    const tempBlob = value as File;
                    arrayBuffer = await tempBlob.arrayBuffer();
                    tempData.set(key, arrayBuffer);
                }

                type = RequestType.Attachment;
                blob = arrayBuffer;

                bodyData = tempData;
            } else {
                console.error(
                    `Not able to add body data with ContentType ${contentType} when building request object for ${url}`
                );
            }
        }

        return new OfflineUpdateRequest(
            url,
            request.method,
            bodyData,
            type,
            null,
            Date.now(),
            blob
        );
    }
}
