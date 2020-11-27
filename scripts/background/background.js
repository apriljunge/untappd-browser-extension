import BrowserStorage from './storage/BrowserStorage.js';
import Authentication from './untappd/Authentication.js';

const UntappdAccessToken = new BrowserStorage('Untappd-AccessToken');
const Auth = new Authentication();

const authenticate = async () => {
    UntappdAccessToken.value = await Auth.token;
};

const requestUserAction = () => {

};

const checkToken = async () => {
    if (await UntappdAccessToken.value === undefined) {
        requestUserAction();
    }
};

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.execute) {
        case 'authenticate':
            authenticate();
            break;
    }
});

checkToken();
