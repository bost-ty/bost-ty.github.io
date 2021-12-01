/* Following some information from:
 *    https://dev.twitch.tv/docs/authentication/getting-tokens-oauth#oauth-implicit-code-flow
 *    https://stackoverflow.com/questions/61647395/how-to-add-oauth-token-in-js-for-twitch-api
 *    https://discuss.dev.twitch.tv/t/requiring-oauth-for-helix-twitch-api-endpoints/23916
 *    https://github.com/twitchdev/authentication-node-sample/blob/main/index.js
 *    https://discuss.dev.twitch.tv/t/getting-user-ids/13806/8
 */

/* FAKE SECRETS */
const AUTH_TOKEN = "ABCD1234";

const authBtn = document.getElementById("authBtn");

function onAuthSubmit() {
  // Do things!
  fetchAsync("https://api.artic.edu/api/v1/artworks/129884?fields=thumbnail").then((data) => console.log(data));

  // window.location.href = "https://bost-ty.github.io";
}

/** Example POST method implementation:
 *   async function postData(url = '', data = {}) {
 *     // Default options are marked with *
 *     const response = await fetch(url, {
 *       method: 'POST', // *GET, POST, PUT, DELETE, etc.
 *       mode: 'cors', // no-cors, *cors, same-origin
 *       cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
 *       credentials: 'same-origin', // include, *same-origin, omit
 *       headers: {
 *         'Content-Type': 'application/json'
 *         // 'Content-Type': 'application/x-www-form-urlencoded',
 *       },
 *       redirect: 'follow', // manual, *follow, error
 *       referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
 *       body: JSON.stringify(data) // body data type must match "Content-Type" header
 *     });
 *     return response.json(); // parses JSON response into native JavaScript objects
 *   }
 *
 *   postData('https://example.com/answer', { answer: 42 })
 *     .then(data => {
 *       console.log(data); // JSON data parsed by `data.json()` call
 *     });
 **/

// Define variables for ease of use, clarity of requests
const baseURL = "https://api.twitch.tv/helix";
const twitchAuthPOSTUrl = `${baseURL}/some/path`;
const twitchAuthPOSTHeaders = new Headers({
  "Authorization-Bearer": AUTH_TOKEN,
});

let dataPOST = { data1: "abcd1234" }; // whatever it is
const twitchAuthPOSTBody = JSON.stringify(dataPOST); // intermediate variable... not sure about this one.
const twitchAuthPOSTInit = {
  method: "POST", // default: GET
  headers: twitchAuthPOSTHeaders,
  body: twitchAuthPOSTBody,
};
// Put it all together...
const twitchAuthPOSTRequest = new Request(
  twitchAuthPOSTUrl,
  twitchAuthPOSTInit
);

// This is by default a GET after a non-modified call to a URL
async function fetchAsync(url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}
