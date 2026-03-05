import axios from 'axios';
import { Signature } from './signature.js';

const BASE_URL = 'https://api.searchad.naver.com';

export class NaverAdApiClient {
    #apiKey;
    #secretKey;
    #customerId;

    constructor({ apiKey, secretKey, customerId }) {
        this.#apiKey = apiKey;
        this.#secretKey = secretKey;
        this.#customerId = customerId;
    }

    #getHeader(method, uri) {
        const timestamp = Date.now().toString();
        const signature = Signature.generate(timestamp, method, uri, this.#secretKey);
        return {
            'Content-Type': 'application/json; charset=UTF-8',
            'X-Timestamp': timestamp,
            'X-API-KEY': this.#apiKey,
            'X-Customer': this.#customerId.toString(),
            'X-Signature': signature
        };
    }

    async request(method, uri, { params, data } = {}) {
        const response = await axios({
            method,
            url: BASE_URL + uri,
            params,
            data,
            headers: this.#getHeader(method, uri)
        });
        return response.data;
    }
}