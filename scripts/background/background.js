import Untappd from './Untappd/Untappd.js';
import CachedStorage from './CachedStorage/CachedStorage.js';

class Main {
    constructor() {
        this.untappdTokenStorage = new CachedStorage('Untappd-AccessToken');
        this.untappdApi = new Untappd();

        this.addListeners();

        this.asyncConstructor();
    }
    addListeners() {
        browser.browserAction.onClicked.addListener(() => this.authenticateWithUntappd())
    }
    async asyncConstructor() {
        this.untappdToken = await this.untappdTokenStorage.value;
        if (this.untappdToken === undefined) {
            this.requestUserAction();
        }
    }
    async authenticateWithUntappd() {
        this.untappdToken = await this.untappdApi.authenticate();
        this.untappdTokenStorage.value = this.untappdToken;
        console.log(this.untappdToken);
    }
    requestUserAction() {
        browser.browserAction.setBadgeBackgroundColor({color: "orange"});
        browser.browserAction.setBadgeText({text: "?"});
    }
}

new Main();
