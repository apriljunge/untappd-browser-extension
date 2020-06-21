import Api from './Api.js';

import {buildUrlWithSearchParms} from "../utils.js";
import {UntappdClientSecret} from "../../secrets.js";

export default class Authentication extends Api {
    constructor() {
        super();

        this.baseUrl = "https://untappd.com/oauth/";
        this.redirectUrl = browser.identity.getRedirectURL();
    }
    get token() {
        return new Promise((resolve) => {
            this.authenticate()
                .then((redirectUrl) => {
                    return this.extractUrlParameter(redirectUrl, 'code');
                })
                .then((code) => {
                    return this.authorize(code);
                })
                .then(({access_token}) => {
                    resolve(access_token);
                });
        });
    }
    authenticate() {
        const authURL = buildUrlWithSearchParms(
            this.baseUrl + 'authenticate',
            {
                client_id: this.clientId,
                redirect_url: this.redirectUrl,
                response_type: 'code'
            }
        );

        return browser.identity.launchWebAuthFlow({
            url: authURL,
            interactive: true
        });
    }
    extractUrlParameter(url, parameter) {
        return new URL(url).searchParams.get(parameter);
    }
    authorize(code) {
        return this.getFromApi('authorize', {
            client_id: this.clientId,
            client_secret: UntappdClientSecret,
            redirect_url: this.redirectUrl,
            response_type: 'code',
            code: code
        });
    }
}