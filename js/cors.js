/**
 * Counter the CORS problem
 * @type {string}
 */
var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
async function doCORSRequest(options) {
    return await $.get(cors_api_url+options.url);
}
