import { hashGenerator2 } from "../routing/hash";
import { describe, expect, it } from '@jest/globals'
import axios from 'axios';
import { HttpResponseMessage } from "./httpRequestMessage";
import { mockedResponse } from "./axios.requests";


export class Tag {
    id: string;
    constructor(id: string) {
        this.id = id;
    }
}

describe('HttpReqestMessage', () => {
    
    it('Should get all arguments from http request ', async () => {
        
        const httpRequestMessage = new HttpResponseMessage<Tag>(mockedResponse);
    });
});