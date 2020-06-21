import {UntappdClientId} from "../../secrets.js";
import {buildUrlWithSearchParms} from '../utils.js'

export default class Api {
    constructor() {
        this.baseUrl = "https://api.untappd.com/v4/";
        this.clientId = UntappdClientId;
        this.rateLimit = null;
        this.rateLimitRemaining = null;

        if (!UntappdClientId) {
            throw Error('Please define Untappd Client Id');
        }
    }
    setRateLimit(count) {
        this.rateLimit = count;
    }
    setRateLimitRemaining(count) {
        this.rateLimitRemaining = count;
    }
    getFromApi (path, parameters) {
        return this.callApi(path, parameters)
            .then(this.checkResponseCode)
            .then(this.extractRateLimit)
            .then(this.parseResponseAsJson)
            .then(this.checkMetaResponseCode)
            .then(this.extractResponseFromApiCall)
    }
    callApi(path, parameters = {}) {
        const url = `${this.baseUrl}${path}`;
        const urlWithParameters = buildUrlWithSearchParms(url, parameters);

        //ToDo: think about good user agent for identification
        const request = new Request(urlWithParameters, {
            method: "GET",
            headers: new Headers({'User-Agent': `(${this.clientId})`})
        });

        return fetch(request);
    }
    checkResponseCode(response) {
        if (response.ok === false) {
            throw new Error('Error while fetching Untappd data');
        }

        return response;
    }
    extractRateLimit(response) {
        const headers = response.headers;

        if (headers.has('X-Ratelimit-Limit')) {
            this.setRateLimit(headers.get('X-Ratelimit-Limit'));
        }

        if (headers.has('X-Ratelimit-Remaining')) {
            this.setRateLimitRemaining(headers.get('X-Ratelimit-Remaining'));
        }

        return response;
    }
    parseResponseAsJson(response) {
        return response.json();
    }
    checkMetaResponseCode(responseJson) {
        if (responseJson.meta?.http_code !== 200) {
            throw new Error('Wrong response code from Untappd API');
        }

        return responseJson;
    }
    extractResponseFromApiCall(responseJson) {
        return responseJson.response;
    }
}