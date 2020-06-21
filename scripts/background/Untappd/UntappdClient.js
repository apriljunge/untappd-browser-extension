import {UntappdClientId} from "./secrets.js";
import {buildUrlWithSearchParms} from '../utils.js'

export default class UntappdClient {
    constructor() {
        this.baseUrl = "https://api.untappd.com/v4/";
        this.clientId = UntappdClientId;
        this.rateLimit = null;
        this.rateLimitRemaining = null;

        if (!UntappdClientId) {
            throw Error('Please define Untappd Client Id');
        }
    }
    _setRateLimit(count) {
        this.rateLimit = count;
    }
    _setRateLimitRemaining(count) {
        this.rateLimitRemaining = count;
    }
    _getFromApi (path, parameters) {
        return this._callApi(path, parameters)
            .then(this._checkResponseCode)
            .then(this._extractRateLimit)
            .then(this._parseResponseAsJson)
            .then(this._checkMetaResponseCode)
            .then(this._extractResponseFromApiCall)
    }
    _callApi(path, parameters = {}) {
        const url = `${this.baseUrl}${path}`;
        const urlWithParameters = buildUrlWithSearchParms(url, parameters);

        const request = new Request(urlWithParameters, {
            method: "GET",
            headers: new Headers({'User-Agent': `Bla bla bla (${this.clientId})`})
        });

        return fetch(request);
    }
    _checkResponseCode(response) {
        if (response.ok === false) {
            throw new Error('Error while fetching Untappd data');
        }

        return response;
    }
    _extractRateLimit(response) {
        const headers = response.headers;

        if (headers.has('X-Ratelimit-Limit')) {
            this._setRateLimit(headers.get('X-Ratelimit-Limit'));
        }

        if (headers.has('X-Ratelimit-Remaining')) {
            this._setRateLimitRemaining(headers.get('X-Ratelimit-Remaining'));
        }

        return response;
    }
    _parseResponseAsJson(response) {
        return response.json();
    }
    _checkMetaResponseCode(responseJson) {
        if (responseJson.meta?.http_code !== 200) {
            throw new Error('Wrong response code from Untappd API');
        }

        console.log(responseJson);
        return responseJson;
    }
    _extractResponseFromApiCall(responseJson) {
        console.log(responseJson.response);
        return responseJson.response;
    }
}