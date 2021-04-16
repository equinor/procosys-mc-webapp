import '@testing-library/jest-dom/extend-expect';
import '@equinor/eds-core-react';
import './setupServer';
import { configure } from '@testing-library/react';
declare global {
    interface Window {
        URL: any;
    }
    interface FormData {
        append(): any;
    }
}

configure({
    getElementError: (message: string, container) => {
        const error = new Error(message);
        error.name = 'TestingLibraryElementError';
        error.stack = undefined;
        return error;
    },
});

//Fixes MSAL interfering with the globals
const crypto = require('crypto');
Object.defineProperty(global, 'crypto', {
    value: {
        getRandomValues: (arr: any) => crypto.randomBytes(arr.length),
    },
});
