import Authentication from './untappd/Authentication.js';
import User from './untappd/User.js';

const Auth = new Authentication();
const CurrentUser = new User();

const init = async () => {
    const token = await Auth.token;
    if (token === undefined) {
        requestUserAction();
        return;
    }

    CurrentUser.accessToken = token;
};

const authenticate = async () => {
    await Auth.authenticate();
    const token = await Auth.token;
    CurrentUser.accessToken = token;
    browser.runtime.sendMessage({ loggedIn: token !== undefined });
};

const syncBeers = async () => {
    await CurrentUser.syncBeers();
    const beers = await CurrentUser.beers;
    browser.runtime.sendMessage({
        beercount: beers.length,
        rateLimit: CurrentUser.rateLimit,
        rateLimitRemaining: CurrentUser.rateLimitRemaining
    });
};

const requestUserAction = () => {
    // switch Icon
};

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.execute) {
        case 'authenticate':
            (async () => {
                await authenticate();
                // await syncBeers();
            })();
            break;
        case 'sync':
            (async () => {
                await syncBeers();
            })();
            break;
    }
    switch (request.get) {
        case 'loginstatus':
            (async () => {
                const token = await Auth.token;
                sendResponse({ loggedIn: token !== undefined });
            })();
            return true;
        case 'beercount':
            (async () => {
                const beers = await CurrentUser.beers;
                sendResponse({ beercount: beers.length });
            })();
            return true;
    }
});

init();
