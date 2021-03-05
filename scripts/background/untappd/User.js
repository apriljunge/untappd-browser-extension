import Api from './Api.js';

export default class User extends Api {
    constructor () {
        super();

        this._beers = null;

        this.config = {
            ...this.config,
            storagePrefix: 'untappd-user-',
            baseUrl: this.config.baseUrl + 'user/',
            accessToken: null,
            beersPerRequest: 50 // max: 50
        };
    }

    get accessToken () {
        return false;
    }

    set accessToken (token) {
        this.config.accessToken = token;
    }

    get beers () {
        return new Promise(resolve => {
            if (this._beers !== null) {
                resolve(this._beers);
            }
            this.getFromStorage('beers')
                .then((beers) => {
                    if (beers === undefined) {
                        beers = [];
                    }
                    this._beers = beers;
                    resolve(this._beers);
                });
        });
    }

    async syncBeers () {
        if (this.config.accessToken === null) {
            return; // TODO throw error
        }

        const beersPerRequest = this.config.beersPerRequest;
        const beers = await this.beers;
        let newBeers = [];

        const firstResponse = await this.getFromApi('beers', {
            access_token: this.config.accessToken,
            offset: 0,
            limit: beersPerRequest
        });

        newBeers = firstResponse.beers.items;

        const pendingBeers = firstResponse.total_count - beersPerRequest - beers.length;
        const pendingRequests = Math.ceil(pendingBeers / beersPerRequest);

        // TODO Check if remaining limit is enough
        // TODO Check if limit in general is enough

        const runningRequests = [];
        for (let i = 1; i <= pendingRequests; i++) {
            const request = this.getFromApi('beers', {
                access_token: this.config.accessToken,
                offset: i * beersPerRequest,
                limit: beersPerRequest
            });
            runningRequests.push(request);
        }

        const apiResponses = await Promise.allSettled(runningRequests);
        apiResponses.forEach(({ value }) => {
            newBeers = newBeers.concat(value.beers.items);
        });

        newBeers.reverse();
        newBeers.forEach((newItem) => {
            let alreadyExists = false;
            for (let i = 0; i < beers.length; i++) {
                if (beers[i].beer.bid === newItem.beer.bid) {
                    beers[i] = newItem;
                    alreadyExists = true;
                    break;
                }
            }

            if (alreadyExists === false) {
                beers.unshift(newItem);
            }
        });

        this._beers = beers;
        this.saveInStorage('beers', beers);
    }
}
