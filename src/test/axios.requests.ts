/* eslint-disable prettier/prettier */
// import axios from 'axios';
import mockAxios from "jest-mock-axios";

jest.mock("axios");

const data = {
    arguments: {},
    data: {},
    status: 200,
};
export const mockedResponse = mockAxios.mockResponseFor({url: '/get'}, {data: "test"});
//export const mockedResponse = mockAxios.get.mockResponseFor({url: '/get'}, {data: "test"});

