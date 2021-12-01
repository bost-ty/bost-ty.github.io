/* Following some information from:
 *    https://dev.twitch.tv/docs/authentication/getting-tokens-oauth#oauth-implicit-code-flow
 *    https://stackoverflow.com/questions/61647395/how-to-add-oauth-token-in-js-for-twitch-api
 *    https://discuss.dev.twitch.tv/t/requiring-oauth-for-helix-twitch-api-endpoints/23916
 *    https://github.com/twitchdev/authentication-node-sample/blob/main/index.js
 *    https://discuss.dev.twitch.tv/t/getting-user-ids/13806/8
 */

/* ******************
 * Global variables *
 ****************** */

const p = document.createElement("p");

const CLIENT_ID = "";
const REDIRECT_URI = "https://bost-ty.github.io/twitch";
const REQUEST_SCOPE = encodeURIComponent("channel:read:redemptions bits:read"); // https://dev.twitch.tv/docs/authentication#scopes
console.log(REQUEST_SCOPE);

const twitchValidationEndpoint = "https://id.twitch.tv/oauth2/validate";
const TOKEN_URL = `https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${REQUEST_SCOPE}`;

const hashCheck = document.location.hash && document.location.hash != "";
const parsedHash = hashCheck
  ? new URLSearchParams(document.location.hash.substr(1))
  : null;
const AUTH_TOKEN = getAuthToken(parsedHash);
const AUTH_SCOPE = getAuthScope(parsedHash);

/* *****************
 * Text population *
 ***************** */

if (AUTH_TOKEN) {
  document.getElementById(
    "authTokenText"
  ).innerText = `Auth token: ${AUTH_TOKEN}`;
}

if (AUTH_SCOPE) {
  document.getElementById(
    "authScopeText"
  ).innerText = `Auth scope: ${AUTH_SCOPE}`;
}

/* **************
 * Fetch calls *
 ************** */
// "Enter Twithc OAuth Implicit flow"
async function onAuthSubmit() {
  return await fetch(TOKEN_URL)
    .then((res) => res.json())
    .catch((err) => console.log("Error: " + err));
}

// "Validate OAuth code (before each request)"
async function validateTwitchRequest() {
  return await fetch(twitchValidationEndpoint, {
    headers: { Authorization: `Bearer: ${AUTH_TOKEN}` },
  })
    .then((res) => res.ok)
    .catch((err) => console.log("Error: " + err));
}

// "Get Twitch Channel"
async function getTwitchChannel(user) {
  let response = await fetch(URL);
  let data = await response.json();
  return data;
}

/* ******************
 * Utilities, getters *
 ****************** */
function getAuthToken(parsedHash) {
  if (parsedHash) {
    if (parsedHash.get("access_token")) {
      return parsedHash.get("access_token");
    } else return null;
  }
}

function getAuthScope(parsedHash) {
  if (parsedHash) {
    if (parsedHash.get("scope")) {
      return decodeURIComponent(parsedHash.get("scope"));
    } else return null;
  }
}

// Define variables for ease of use, clarity of future requests
const twitchBaseURL = "https://api.twitch.tv/helix";
const twitchAuthHeaders = {
  "Client-Id": CLIENT_ID,
  Authorization: `Bearer: ${AUTH_TOKEN}`,
};

function definePostData() {
  let dataPOST = {};
  if (AUTH_TOKEN) {
    let dataPOST = { data1: "abcd1234" }; // TODO: Set data to be posted (programmatically)
  }
  return dataPOST;
}

const twitchAuthPOSTBody = JSON.stringify(definePostData());
const twitchAuthPOSTInit = {
  method: "POST",
  headers: twitchAuthHeaders,
  body: twitchAuthPOSTBody,
};

// Put it all together...
const twitchAuthPOSTRequest = new Request(
  `${twitchBaseURL}/some/query`,
  twitchAuthPOSTInit
);

/* This is by default a GET after a non-modified call to a URL
let response = await fetch(url);
let data = await response.json();
return data;
*/

/* ----------

// Example POST method implementation:
async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

postData("https://example.com/answer", { answer: 42 }).then((data) => {
  console.log(data); // JSON data parsed by `data.json()` call
});

---------- */

/* 

// These are set for the GitHub Pages Example
        // Substitute as needed
        var client_id = 'hozgh446gdilj5knsrsxxz8tahr3koz';
        var redirect = 'https://barrycarlyon.github.io/twitch_misc/authentication/implicit_auth/';

        document.getElementById('authorize_public').setAttribute('href', 'https://id.twitch.tv/oauth2/authorize?client_id=' + client_id + '&redirect_uri=' + encodeURIComponent(redirect) + '&response_type=token');
        document.getElementById('authorize_email').setAttribute('href', 'https://id.twitch.tv/oauth2/authorize?client_id=' + client_id + '&redirect_uri=' + encodeURIComponent(redirect) + '&response_type=token&scope=user:read:email');
        document.getElementById('access_token').textContent = '';

        if (document.location.hash && document.location.hash != '') {
            var parsedHash = new URLSearchParams(window.location.hash.substr(1));
            if (parsedHash.get('access_token')) {
                var access_token = parsedHash.get('access_token');
                document.getElementById('access_token').textContent = 'Your Access Key from the #url: ' + access_token;

                document.getElementById('user_data').textContent = 'Loading';

                // call API
                fetch(
                    'https://api.twitch.tv/helix/users',
                    {
                        "headers": {
                            "Client-ID": client_id,
                            "Authorization": "Bearer " + access_token
                        }
                    }
                )
                .then(resp => resp.json())
                .then(resp => {
                    document.getElementById('user_data').innerHTML = '<p>Your Twitch Profile from Helix:</p>';
                    var table = document.createElement('table');
                    document.getElementById('user_data').append(table);
                    for (var key in resp.data[0]) {
                        var tr = document.createElement('tr');
                        table.append(tr);
                        var td = document.createElement('td');
                        td.textContent = key;
                        tr.append(td);
                        var td = document.createElement('td');
                        td.textContent = resp.data[0][key];
                        tr.append(td);
                    }
                })
                .catch(err => {
                    console.log(err);
                    document.getElementById('user_data').textContent = 'Something went wrong';
                });
            }
        } else if (document.location.search && document.location.search != '') {
            var parsedParams = new URLSearchParams(window.location.search);
            if (parsedParams.get('error_description')) {
                document.getElementById('access_token').textContent = parsedParams.get('error') + ' - ' + parsedParams.get('error_description');
            }
        }
*/
