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
const div = document.createElement("div");
const p = document.createElement("p");
const button = document.createElement("button");

let textToAppend = "";

// Constants and URLS:
const CLIENT_ID = "4d0w57jv6t6hkyux5gvgqtos3bx9kx";
const REQUEST_SCOPE = encodeURIComponent("channel:read:redemptions bits:read"); // https://dev.twitch.tv/docs/authentication#scopes
const REDIRECT_URI = "https://bost-ty.github.io/twitch/";
const h = `https://`
const TWITCH_VALIDATION_ENDPOINT = `${h}id.twitch.tv/oauth2/validate`;
const TOKEN_URL = `${h}id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI} &response_type=token&scope=${REQUEST_SCOPE}`;
const TWITCH_API_URL = `${h}api.twitch.tv/helix`;

// Hashes and products of hashes:
let hashCheck = document.location.hash && document.location.hash != "";
let parsedHash = hashCheck
  ? new URLSearchParams(document.location.hash.substr(1))
  : null;
const AUTH_TOKEN = getAuthToken(parsedHash);
const AUTH_SCOPE = getAuthScope(parsedHash);

const TWITCH_AUTH_HEADERS = {
  Authorization: `Bearer ${AUTH_TOKEN}`,
  "Client-Id": CLIENT_ID,
};

/* ********************
 * Utilities, getters *
 ******************** */

/**
 * Update textToAppend for display on page
 * @param {string} newText
 * @returns {string} textToAppend
 */
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

// Display token if found
if (AUTH_TOKEN) {
  document.getElementById("authTokenText").innerText = `Token: ${AUTH_TOKEN}`;
}

// Display scope(s) if found
if (AUTH_SCOPE) {
  document.getElementById(
    "authScopeText"
  ).innerText = `Scope(s): ${AUTH_SCOPE.split(" ").join(", ")}`;
}

// "When token and scopes are retrieved..."
if (AUTH_TOKEN && AUTH_SCOPE) {
  p.append(textToAppend);
  div.append(p);
  MAIN.append(div);
}

/* *************
 * Fetch calls *
 ************* */

// "Enter Twitch OAuth Implicit flow"
async function onAuthSubmit() {
  window.location.href = TOKEN_URL;
  return;
}

// "Get value of a certain element (by id)"
function getInputValue(inputId) {
  const inputValue = document.getElementById(inputId).value;
  return inputValue;
}

// "Get Twitch User Information"
async function fetchUserInformation(username) {
  const userInformation = await fetch(
    username
      ? `${TWITCH_API_URL}/users?login=${username}`
      : `${TWITCH_API_URL}/users`,
    {
      headers: TWITCH_AUTH_HEADERS,
    }
  )
    .then((res) => res.json())
    .catch((err) => console.log("Error: " + err));

  console.log(userInformation.data[0]);
  return userInformation;
}

// "Called when 'Get User Information' button is submitted"
async function onUsernameInputSubmit() {
  const username = getInputValue("usernameInput");
  return await fetchUserInformation(username);
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
  headers: TWITCH_AUTH_HEADERS,
  body: twitchPOSTBody,
};

// Put it all together...
const twitchAuthPOSTRequest = new Request(
  `${TWITCH_API_URL}/some/query`,
  twitchPOSTInit
);

