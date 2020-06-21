import UntappdAuthentication from "./Authentication/Authentication.js";

export default class Untappd{
    constructor() {

    }
    authenticate() {
        return new UntappdAuthentication();
    }
};
