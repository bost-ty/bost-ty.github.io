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

// DOM creation & manipulation:
const MAIN = document.getElementById("main");
let textToAppend = "";
const div = document.createElement("div");
const p = document.createElement("p");
const button = document.createElement("button");

// Constants and URLS:
const globalPollInterval = 1000; // ms
const CLIENT_ID = "4d0w57jv6t6hkyux5gvgqtos3bx9kx";
const REDIRECT_URI = "https://bost-ty.github.io/twitch";
const REQUEST_SCOPE = encodeURIComponent("channel:read:redemptions bits:read"); // https://dev.twitch.tv/docs/authentication#scopes

const twitchValidationEndpoint = "https://id.twitch.tv/oauth2/validate";
const TOKEN_URL = `https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${REQUEST_SCOPE}`;

// Hashes and products of hashes:
const hashCheck = document.location.hash && document.location.hash != "";
const parsedHash = hashCheck
  ? new URLSearchParams(document.location.hash.substr(1))
  : null;
const AUTH_TOKEN = getAuthToken(parsedHash);
const AUTH_SCOPE = getAuthScope(parsedHash);

const twitchBaseURL = "https://api.twitch.tv/helix";
const twitchAuthHeaders = {
  Authorization: `Bearer ${AUTH_TOKEN}`,
  "Client-Id": CLIENT_ID,
};

const twitchInit = {
  mode: "no-cors",
  headers: twitchAuthHeaders,
};

/* ********************
 * Utilities, getters *
 ******************** */

// "Update textToAppend for display on page"
function updateTextToAppend(newText) {
  if (textToAppend === newText) return textToAppend;
  textToAppend = newText;
  return textToAppend;
}

// "Return auth token from parsed URI hash"
function getAuthToken(parsedHash) {
  if (parsedHash) {
    if (parsedHash.get("access_token")) {
      return parsedHash.get("access_token");
    } else return null;
  }
}

// "Return auth scope(s) from parsed URI hash"
function getAuthScope(parsedHash) {
  if (parsedHash) {
    if (parsedHash.get("scope")) {
      return decodeURIComponent(parsedHash.get("scope"));
    } else return null;
  }
}

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

// "When token and scopes are retrieved..."
if (AUTH_TOKEN && AUTH_SCOPE) {
  p.append(textToAppend);
  div.append(p);
  MAIN.append(div);

  let ARBITRARY_CONDITION = true;
  let pollForEvents = setInterval(() => {
    console.log("Event polled...");
    if (ARBITRARY_CONDITION) {
      clearInterval(pollForEvents);
      console.log("Clearing interval...");
    }
  }, globalPollInterval);
}

/* *************
 * Fetch calls *
 ************* */

// "Enter Twitch OAuth Implicit flow"
async function onAuthSubmit() {
  window.href = "https://google.com";
  let response = await fetch(TOKEN_URL, { mode: "no-cors" })
    .then((res) => {
      return res;
    })
    .catch((err) => console.log("Error: " + err));
  console.log(response);
  return response;
}

// Get value of a certain input or element
function getInputValue(inputId) {
  const inputValue = document.getElementById(inputId).value;
  return inputValue;
}

// let usernameValue = "";
// // "Get text input change, save it to variable"
// function onInputChange(inputId, usernameValue) {
//   usernameValue = getInputValue(userna);
//   return usernameValue;
// }

// "Get Twitch User Information"
async function getUserInformation(username) {
  const queryURL = `${twitchBaseURL}/users?login=${username}`;

  let data = await fetch(queryURL, twitchInit)
    .then((res) => {
      res.json;
    })
    .catch((err) => console.log("Error: " + err));

  console.log("Data, ", data);
  return data;
}

// "Submit usernameInput request"
async function onUsernameInputSubmit() {
  const username = getInputValue("usernameInput");
  if (username) {
    let userInformation = await getUserInformation(username);
    updateTextToAppend(userInformation);
    return userInformation;
  }
}

/* *******************
 * POST Request Land *
 ******************* */

function definePostData() {
  let dataPOST = {};
  if (AUTH_TOKEN) {
    let dataPOST = { data1: "abcd1234" }; // TODO: Set data to be posted (programmatically)
  }
  return dataPOST;
}

const twitchPOSTBody = JSON.stringify(definePostData());
const twitchPOSTInit = {
  method: "POST",
  headers: twitchAuthHeaders,
  body: twitchPOSTBody,
};

// Put it all together...
const twitchAuthPOSTRequest = new Request(
  `${twitchBaseURL}/some/query`,
  twitchPOSTInit
);

/* --- NOTES, REFERENCE --- */
/* These are set for the GitHub Pages Example
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
