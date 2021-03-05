import Api from './Api.js';

import { buildUrlWithSearchParms } from '../utils.js';
import { UntappdClientSecret } from '../../secrets.js';

export default class Authentication extends Api {
    constructor () {
        super();

        this._token = null;

        this.config = {
            ...this.config,
            baseUrl: 'https://untappd.com/oauth/',
            storagePrefix: 'untappd-authentication-',
            redirectUrl: browser.identity.getRedirectURL()
        };
    }

    get token () {
        return new Promise((resolve) => {
            if (this._token !== null) {
                resolve(this._token);
            }

            this.getFromStorage('token')
                .then((token) => {
                    this._token = token;
                    resolve(this._token);
                });
        });
    }

    async authenticate () {
        const redirectUrl = await this.launchWebAuth();
        const code = this.extractUrlParameter(redirectUrl, 'code');
        /* eslint-disable camelcase */
        const { access_token } = await this.authorize(code);
        this._token = access_token;
        /* eslint-enable camelcase */
        this.saveInStorage('token', access_token);
    }

    launchWebAuth () {
        const authURL = buildUrlWithSearchParms(
            this.config.baseUrl + 'authenticate',
            {
                client_id: this.config.clientId,
                redirect_url: this.config.redirectUrl,
                response_type: 'code'
            }
        );

        return browser.identity.launchWebAuthFlow({
            url: authURL,
            interactive: true
        });
    }

    extractUrlParameter (url, parameter) {
        return new URL(url).searchParams.get(parameter);
    }

    authorize (code) {
        return this.getFromApi('authorize', {
            client_id: this.config.clientId,
            client_secret: UntappdClientSecret,
            redirect_url: this.config.redirectUrl,
            response_type: 'code',
            code: code
        });
    }
}
