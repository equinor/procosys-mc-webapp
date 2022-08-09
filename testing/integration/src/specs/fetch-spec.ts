import procosysApiService from '../../../../src/services/procosysApi';

import { expect } from 'chai';
import 'chai/register-should';

describe('Given a fetchAPI', async () => {
    it('http request for plants', async () => {
        const procosysApiInstance = procosysApiService(
            {
                baseURL: 'https://pcs-main-api-dev.azurewebsites.net/api',
                apiVersion: '1.4',
            },
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiIyZDBlZDgwZi0zMDEzLTQyMmQtYjhiZC0yYjhhYzcwYjJjZTEiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8zYWE0YTIzNS1iNmUyLTQ4ZDUtOTE5NS03ZmNmMDViNDU5YjAvIiwiaWF0IjoxNjYwMDI5OTk0LCJuYmYiOjE2NjAwMjk5OTQsImV4cCI6MTY2MDAzNTA2MSwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhUQUFBQTZBcXdLSkhuUHJQUG5namIwbFQyY0VKRFZDRjA4RzFyK3kzZWNOa3d4bDIzNjNocmErMWZ0MzR2VkhhKzc3cHAyZVBsaTlwT1F2UCtjWlFSdTMyU3lYL0JqTE0xQ295T2dQQys0NzZIaWZJPSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwaWQiOiIzZDk5ZTRhYy1lMjliLTQ5NmUtYWVjYS05NWIyMGI2OTI4YmEiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IkJqZXJrZW5lcyIsImdpdmVuX25hbWUiOiJBcmlsZCIsImlwYWRkciI6IjIxMy4yMzYuMTQ4LjQ1IiwibmFtZSI6IkFyaWxkIEJqZXJrZW5lcyIsIm9pZCI6IjQyMzY0M2Q4LTFjNzItNGFhMS05NDBmLWY1NTE4YjZkMjk2YSIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS0yMjA1MjMzODgtMTA4NTAzMTIxNC03MjUzNDU1NDMtMjQ3ODczNyIsInJoIjoiMC5BUUlBTmFLa091SzIxVWlSbFhfUEJiUlpzQV9ZRGkwVE1DMUN1TDByaXNjTExPRUNBRDAuIiwic2NwIjoid2ViX2FwaSIsInN1YiI6IlVPVkVpWmVwUlRPNHIxVnpxNDBNMkd1XzRCc2tTODY3OXNTR2owcENLSDQiLCJ0aWQiOiIzYWE0YTIzNS1iNmUyLTQ4ZDUtOTE5NS03ZmNmMDViNDU5YjAiLCJ1bmlxdWVfbmFtZSI6IkFSQkpFQGVxdWlub3IuY29tIiwidXBuIjoiQVJCSkVAZXF1aW5vci5jb20iLCJ1dGkiOiJHeWlvMzA1Q0FVU3k0ZFVKY3hZS0FBIiwidmVyIjoiMS4wIn0.nkMkMT8SJGiXBMCNNbMmSObP9_yzVIm4S_hkiHPiWm6ewlT0FYOMjRtTn-AjLbzTX_Em0Dfxkho7G_Vdb7lLwJ4TgmGTHT9sX5E9IZRXIlHDWF0BGbBvIN5YEWP-wt2f0AANZwEC-VYvsT3CGdUV_EIjnkIMjhjPZcp65en08HgR0mblMPbqBqVcSyzLmFEvNuvggAbezpz1yH0fEH0bWRXOKS406QtkgLpVDEGMlYyuzkqqeTlgGPjeWNWKz9PT0JzYwXYReT1667Rt4bhWxXxiDhXUnoDB2NtII1eigpDrGg7wuuhyPRAmUtmgUXC9wEjF_Rqcp54GXR5q7SQ5KQ'
        );
        const plants = await procosysApiInstance.getPlants();
        expect(plants.length).to.be.greaterThan(1);
    });
});
