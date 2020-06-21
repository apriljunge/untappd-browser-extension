import BrowserStorage from './storage/BrowserStorage.js';
import Authentication from './untappd/Authentication.js';

const UntappdAccessToken = new BrowserStorage('Untappd-AccessToken');
const Auth = new Authentication();

const authenticate = async () => {
    UntappdAccessToken.value = await Auth.token;
};

const requestUserAction = () => {
    browser.browserAction.setBadgeBackgroundColor({ color: 'pink' });
    browser.browserAction.setBadgeText({ text: 'CC' });
};

const checkToken = async () => {
    if (await UntappdAccessToken.value === undefined) {
        requestUserAction();
    }
};

browser.browserAction.onClicked.addListener(authenticate);

checkToken();
