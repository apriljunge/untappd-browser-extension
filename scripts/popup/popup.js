const mainElement = document.querySelector('main');

browser.storage.onChanged.addListener((changes, areaname) => {
    const changedItems = Object.keys(changes);

    for (const item of changedItems) {
        switch (item) {
            case 'Untappd-AccessToken':
                if (changes[item] !== '') {
                    mainElement.classList.add('logged-in');
                } else {
                    mainElement.classList.remove('logged-in');
                }
                break;
        }
    }
});

document.querySelectorAll('[data-authenticate]').forEach((element) => {
    element.addEventListener('click', () => {
        browser.runtime.sendMessage({
            execute: 'authenticate'
        });
    });
});
