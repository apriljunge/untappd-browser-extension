const mainElement = document.querySelector('main');

const init = async () => {
    const { loggedIn } = await browser.runtime.sendMessage({ get: 'loginstatus' });
    setLoginStatus(loggedIn);

    if (loggedIn === true) {
        const { beercount } = await browser.runtime.sendMessage({ get: 'beercount' });
        updateBeerCount(beercount);
    }
};

const setLoginStatus = (loggedIn) => {
    const classList = mainElement.classList;

    if (loggedIn === true) {
        classList.add('logged-in');
    } else {
        classList.remove('logged-in');
    }
};

const updateBeerCount = (beercount) => {
    mainElement.querySelector('[data-replace="beer-count"]').textContent = beercount;
};

browser.runtime.onMessage.addListener(({ loggedIn, beercount }, sender) => {
    if (sender.url.includes('background.html') === false) {
        return;
    }

    if (loggedIn !== undefined) {
        setLoginStatus(loggedIn);
    }

    if (beercount !== undefined) {
        updateBeerCount(beercount);
    }
});

document.querySelectorAll('[data-action]').forEach((element) => {
    element.addEventListener('click', () => {
        browser.runtime.sendMessage({ execute: element.dataset.action });
    });
});

init();
