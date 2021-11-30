/* Following some information from: 
*    https://dev.twitch.tv/docs/authentication/getting-tokens-oauth#oauth-implicit-code-flow
*    https://stackoverflow.com/questions/61647395/how-to-add-oauth-token-in-js-for-twitch-api
*    https://discuss.dev.twitch.tv/t/requiring-oauth-for-helix-twitch-api-endpoints/23916
*    https://github.com/twitchdev/authentication-node-sample/blob/main/index.js
*    https://discuss.dev.twitch.tv/t/getting-user-ids/13806/8
*/

const authBtn = document.getElementById("authBtn")

document.addEventListener("onclick", authBtn, e => {
    console.log(e)
})