import '@testing-library/jest-dom'
import '@equinor/eds-core-react';
import './setupServer';
import { configure } from '@testing-library/react';
declare global {
    interface Window {
        URL: any;
    }
}

configure({
    getElementError: (message: string | null, container) => {
        if (!message) return new Error();
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
