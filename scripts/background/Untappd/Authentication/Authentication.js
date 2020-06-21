import UntappdClient from '../UntappdClient.js';

import {buildUrlWithSearchParms} from "../../utils.js";
import {UntappdClientSecret} from "../secrets.js";

export default class UntappdAuthentication extends UntappdClient {
    constructor() {
        super();

        this.baseUrl = "https://untappd.com/oauth/";
        this.redirectUrl = browser.identity.getRedirectURL();

        return this.getAccessToken();
    }
    async getAccessToken() {
        /* TODO PRETTIER! */
        const redirectUrl = await this._authenticate();
        const code = this._extractUrlParameter(redirectUrl, 'code');
        const {access_token} = await this._authorize(code);

        return access_token;
    }
    _authenticate() {
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
    _extractUrlParameter(url, parameter) {
        return new URL(url).searchParams.get(parameter);
    }
    _authorize(code) {
        return this._getFromApi('authorize', {
            client_id: this.clientId,
            client_secret: UntappdClientSecret,
            redirect_url: this.redirectUrl,
            response_type: 'code',
            code: code
        });
    }
}