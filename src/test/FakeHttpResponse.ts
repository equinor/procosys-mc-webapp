import {
    CheckItem,
    Row,
} from '@equinor/procosys-webapp-components/dist/typings/apiTypes';
import { Cell } from '../services/apiTypes';

export interface IFakeHttpResponse<T> {
    headers: Record<string, string>; // Do we need headers?
    data: T;
}

export const FakeCellHttpResponse = (): IFakeHttpResponse<Cell> => {
    return {
        headers: {
            test: 'something',
        },
        data: {
            value: 'somehint',
            unit: 'cc',
            columnId: 1,
        },
    };
};
