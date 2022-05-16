/* eslint-disable prettier/prettier */
// import axios from 'axios';
import mockAxios from "jest-mock-axios";

jest.mock("axios");

export const httpRequest = {
    arguments: { "Foo": 12, "Bla": 'Test' },
    data: '[1,2,3]',
    status: 200,
};

export const requestMockContent = {  
    arguments: { "Foo": 12, "Bla": 'Test' },
    data: '[1,2,3]', 
    status: 200 };



export const mockedResponse 
= mockAxios.mockResponseFor({ url: '/api/person' }, { data: "test" });


