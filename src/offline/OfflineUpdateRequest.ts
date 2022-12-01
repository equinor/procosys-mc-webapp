import { OfflineSynchronizationError } from '../services/apiTypes';
import { EntityType } from '../typings/enums';
import generateUniqueId from '../utils/generateUniqueId';
import removeBaseUrlFromUrl from '../utils/removeBaseUrlFromUrl';

export enum RequestType {
    Json = 'json',
    Attachment = 'attachment',
}

export enum SyncStatus {
    SYNCHRONIZED = 'synchronized',
    NOT_SYNCHRONIZED = 'not syncronized',
    ERROR = 'error',
}

export class OfflineUpdateRequest {
    uniqueId: string;
    url: string;
    method: string;
    bodyData: any;
    type: RequestType;
    entityId: number | null; //This will be id for checklist, punch or work order. All updates will belong to either of these.
    entityType:
        | EntityType.Checklist
        | EntityType.PunchItem
        | EntityType.WorkOrder
        | null;
    plantId: string;
    timestamp: number;
    responseIsNewEntityId = false;
    syncStatus: SyncStatus = SyncStatus.NOT_SYNCHRONIZED;
    description: string | null;
    blob?: ArrayBuffer; //attachment object for offline content db
    mimeType?: string;
    errorCode?: number;
    errorMessage?: string;

    constructor(
        url: string,
        method: string,
        bodyData: any,
        type: any,
        timestamp: number,
        blob?: ArrayBuffer,
        mimeType?: string
    ) {
        //Get plantId
        const plantId = this.getPlantId(url);

        this.uniqueId = generateUniqueId();
        this.url = url;
        this.plantId = plantId;
        this.method = method;
        this.bodyData = bodyData;
        this.type = type;
        this.timestamp = timestamp;
        this.blob = blob;
        this.mimeType = mimeType;
        this.entityId = null;
        this.entityType = null;
        this.description = null;
    }

    getPlantId(url: string): string {
        const pos = url.indexOf('plantId=PCS$') + 'plantId=PCS$'.length;
        return url.substring(pos, url.indexOf('&', pos));
    }

    hasError(): boolean {
        if (this.errorCode) {
            return true;
        }
        return false;
    }

    getErrorObject(): OfflineSynchronizationError {
        return {
            Id: this.entityId || 0,
            Url: this.url,
            Method: this.method,
            ErrorMsg: this.errorMessage || 'No error',
            ErrorCode: this.errorCode || 0,
        };
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

        let type;
        let bodyData;
        let blob;
        let mimeType;

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
                    mimeType = tempBlob.type;
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
            Date.now(),
            blob,
            mimeType
        );
    }
}
