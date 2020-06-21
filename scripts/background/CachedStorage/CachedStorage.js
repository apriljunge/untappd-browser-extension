export default class CachedStorage {
    constructor(storageKey) {
        this.key = storageKey;
        this.chachedValue = null;
    }
    get value() {
        return new Promise((resolve) => {
            if (this.chachedValue !== null) {
                resolve(this.chachedValue);
            }

            browser.storage.local.get(this.key)
                .then((response) => {resolve(response[this.key]);})
        });
    }
    set value(newValue) {
        return new Promise((resolve) => {
            browser.storage.local.set({[this.key]: newValue})
                .then(() => this.chachedValue = newValue)
                .then(() => resolve())
        });
    }

}