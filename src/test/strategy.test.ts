import { HttpRequestMessageConfig } from '../routing/Http/HttpRequestMessageConfig';
import ProcessBodyStrategy from '../routing/Http/Strategies/ProcessBodyStrategy';
import { Person } from '../services/apiTypes';

describe('ProcessBodyStrategy is depended in a string that can be serialized', () => {
    it('should fail if the configuration is not valid', () => {
        const strategy = new ProcessBodyStrategy<Person>();
        const config = new HttpRequestMessageConfig<Person>({
            method: 'post',
            url: 'http://localhost:3000/api/v1/users',
            baseURL: 'http://localhost:3000',
            data: {
                id: 100,
                azureOid: '12',
                username: '12',
                firstName: '12',
                lastName: '12',
                email: '12',
            },
            params: {},
            headers: {
                'Content-Type': 'application/json',
            },
            responseType: 'json',
        });
        const result = strategy.process<Person>(config?.data);
        expect(result).toBeDefined();
        // expect(result).toBe('{"name":"test","age":"test"}');
    });
});
