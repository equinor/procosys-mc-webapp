import procosysApiByFetchService, { ProcosysApiByFetchService, procosysApiByFetchProps } from '../fetchLibrary/procosysApiByFetch'

import { expect } from 'chai';
import 'chai/register-should';
import { access } from 'fs';
import { partial } from 'lodash';


describe('Given a fetchAPI', async () => {

    it('http request for plants', async () => {

        const procosysApiByFetchInstance = procosysApiByFetchService(
            {
                baseURL: 'https://pcs-main-api-dev.azurewebsites.net/api',
                apiVersion: '1.4'
            },
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiJkZDM4ZjE2OS1iY2NmLTRkMGUtYTRhZC1kODMwODkzY2ZhNzUiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8zYWE0YTIzNS1iNmUyLTQ4ZDUtOTE5NS03ZmNmMDViNDU5YjAvIiwiaWF0IjoxNjU5NDUzNzk4LCJuYmYiOjE2NTk0NTM3OTgsImV4cCI6MTY1OTQ1NzcwNywiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhUQUFBQTljeDFwMDgyY2x5bTB1Y3VJc2p6RzF2dkphYzdzZ3lHL2NGK2hFN0ZSSG0zbURuQk82azJJM1NOeFJmbWVkTWRYT2kySFNQbVV2RzFLY1ZTNU5IUkhHYXM1VityTjlmU1p0eEV1VEpXVTY0PSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwaWQiOiI2YmNlZmY0OC05ZmVkLTQ2MDMtYjA0Ny0wNzhlOWUyZTEyYTkiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IkhhbHZvcnNlbiIsImdpdmVuX25hbWUiOiJEYW4gRWR2YXJkIiwiaXBhZGRyIjoiMjEzLjIzNi4xNDguNDUiLCJuYW1lIjoiRGFuIEVkdmFyZCBIYWx2b3JzZW4iLCJvaWQiOiI3OTE0ZDhkYy03MTRiLTRjNzItYjA0NC05MjZlN2Y4YTVhY2QiLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtMjIwNTIzMzg4LTEwODUwMzEyMTQtNzI1MzQ1NTQzLTI2MzQ0NTIiLCJyaCI6IjAuQVFJQU5hS2tPdUsyMVVpUmxYX1BCYlJac0dueE9OM1B2QTVOcEszWU1JazgtblVDQUJVLiIsInNjcCI6IndlYl9hcGkiLCJzdWIiOiJkVFBUMUlqM3FVeUdEVjNJNmlQZUwtY3BGTmc4SjE5TzByOHJPZGRsTFhFIiwidGlkIjoiM2FhNGEyMzUtYjZlMi00OGQ1LTkxOTUtN2ZjZjA1YjQ1OWIwIiwidW5pcXVlX25hbWUiOiJERUhBQGVxdWlub3IuY29tIiwidXBuIjoiREVIQUBlcXVpbm9yLmNvbSIsInV0aSI6ImI4MWNNN01BWFV5cTVVcnJJMUFXQUEiLCJ2ZXIiOiIxLjAifQ.oXZ2QlvRHxwLd8vF453tgUyfV2eFyoUgPJi5XzcQyxr7RLGpo_uKqcv-CgzycWuq7Fc3xqbuEx1GpuTVenCj7Yg_BDn8Mn812vSXgAxcOxFBMn1gRXkZfs7ujIRMN4fFXN57NH0WP5eMph94D6rtqsMZURHQ5uEno1CkVFXw9Q0NKOV7B0zrWp0YLuN0zFauvSDhAHx4S587KQkXbPKQQcIB-Fbg9MxBUZS84zO15t1pYShXi2OAijc0Sws4_l53xvxdDFqR0RaIJ9DDtTk0BwEFGJsMGArtSUton9rd3cSqwEZpzrOuIetSutAKLd2boFFGQnLs1q5nBAQzczoDxQ');
        var plants = await procosysApiByFetchInstance.getPlants();
        true.should.be.true;
    });
    it('test 4', () => {
        expect(true).to.be.true;
    });
});
