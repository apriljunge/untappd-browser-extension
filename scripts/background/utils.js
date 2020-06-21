/**
 *
 * @param url
 * @param parameters
 * @returns {string}
 */
const buildUrlWithSearchParms = function(url, parameters) {
    const urlObject = new URL(url);
    let parameterString = urlObject.search.slice(1);

    parameterString = buildSearchParameterString(parameters, parameterString);
    urlObject.search = '?' + parameterString;

    return urlObject.toString();
}

/**
 *
 * @param parameterObject
 * @param parameterString
 * @returns {string}
 */
const buildSearchParameterString = function(parameterObject, parameterString = '') {
    let parameter = new URLSearchParams(parameterString);

    // Better way of looping over objects
    // https://zellwk.com/blog/looping-through-js-objects/
    for (const [parameterValue, parameterKey] of Object.entries(parameterObject)) {
        parameter.append(parameterValue, parameterKey);
    }

    return parameter.toString();
}

export {
    buildUrlWithSearchParms,
    buildSearchParameterString
}
