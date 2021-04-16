import { render, screen } from '@testing-library/react';
import React from 'react';
import { withPlantContext } from '../../../test/contexts';
import { dummyPunchItemCleared } from '../../../test/dummyData';
import {
    causeApiError,
    ENDPOINTS,
    rest,
    server,
} from '../../../test/setupServer';
import VerifyPunch from './VerifyPunch';

jest.mock('../../../utils/removeSubdirectories', () => {
    return (str: string, num: number): string => '/';
});

beforeAll(() => {
    server.use(
        rest.get(ENDPOINTS.getPunchItem, (_, response, context) => {
            return response(
                context.status(200),
                context.json(dummyPunchItemCleared)
            );
        })
    );
});

describe('<VerifyPunch/> after loading', () => {
    beforeEach(async () => {
        render(withPlantContext({ Component: <VerifyPunch /> }));
        const tagDescription = await screen.findByText(
            'For testing purposes (test 37221)'
        );
        expect(tagDescription).toBeInTheDocument();
    });
    it('Renders description on punch item', async () => {
        const description = screen.getByText('dummy-punch-description');
        expect(description).toBeInTheDocument();
    });
    test.todo('Test the different actions (verify, unclear, reject)');
});
