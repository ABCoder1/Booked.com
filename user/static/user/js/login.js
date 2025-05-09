import {setTokenCookie, generateToken, getTokenFromRefresh, getCookieValue, validateForm} from "./apiService.js"
import {ACCESS_COOKIE, REFRESH_COOKIE, USER_PAGE, BACKEND_PORT, BASE_URL} from "./config.js"

let loginForm = document.forms["login-form"];
let validationErrors = document.querySelector("#validation-errors");

// Function for User Login 
async function login(e){
    e.preventDefault();

    try { 
        // Validate user data
        validateForm(loginForm, validationErrors);
        
        const formdata = new FormData(loginForm);
        const username = formdata.get("username");
        const password = formdata.get("password");

        // Create and set Access/Refresh Tokens in the cookie
        const tokenData = await generateToken(username, password);

        setTokenCookie(tokenData);

        console.log('Successfully set tokens in cookies')

        window.location.href = `http://${BASE_URL}:${BACKEND_PORT}${USER_PAGE}`;
    } catch (error) {
        console.log(`Error occured during login : `, error.message);
    }
}

// Function to login the user if token is present
async function loginWithToken() {
    try {
        const accessToken = getCookieValue(ACCESS_COOKIE);
        const refreshToken = getCookieValue(REFRESH_COOKIE);
        if (accessToken) {
            console.log('Access Token found, logging user in...')
            window.location.href = `http://${BASE_URL}:${BACKEND_PORT}${USER_PAGE}`;
        } else if (refreshToken) {
            console.log('Refresh Token found. Fething token from refresh...')
            const tokenData = await getTokenFromRefresh(refreshToken);
            if (tokenData["access"]) {
                setTokenCookie(tokenData);
                location.reload();
            } else throw new Error(`Token from refresh failed`);
        } else throw new Error(`Token not found`)
    } catch (error) {
        console.log(`${error.message}. User needs to login`)
    }
}

// Adding Event Listener to form's submit button
loginForm.addEventListener("submit", login);
// Adding Event Lister to login user from existing token
document.addEventListener("DOMContentLoaded", loginWithToken);
