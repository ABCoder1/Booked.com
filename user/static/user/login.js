let BASE_URL = "127.0.0.1";
let BACKEND_PORT = "8000";
let LOGIN_ENDPOINT = "/api/token/";
let USER_PAGE = "/index"
const REFRESH_COOKIE = "refresh";

let loginForm = document.forms["login-form"];
let loginButton = loginForm["submit"];
let validationErrors = document.querySelector("#validation-errors");

// This function performs a frontend validation of the values passed from user to backend
function validateForm() {
    const formdata = new FormData(loginForm);
    const username = formdata.get("username");
    const password = formdata.get("password");
    const invalidRegex = /[^_a-zA-Z0-9@.]/;
    
    if (invalidRegex.test(username)) { // Invalid Username
        const errText = "Invalid Username. Try Again !";
        raiseError(errText);
        return errText;
    }
    return null;
}

function raiseError(errText) {
    const errBlock = document.createElement('p');
    errBlock.textContent = errText;
    validationErrors.appendChild(errBlock);
}

// Function for User Login 
async function login(e){
    e.preventDefault();

    // Validate user data
    if (validateForm(e)) {
        console.log('Invalid user input');
        return;
    }
    const formdata = new FormData(loginForm);
    const username = formdata.get("username");
    const password = formdata.get("password");

    // Create Access/Refresh Tokens
    try {
        const response = await fetch(`http://${BASE_URL}:${BACKEND_PORT}${LOGIN_ENDPOINT}`, {
            method: "POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username:username, password:password})
        });
    
        console.log(response);

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            console.log('Login Successful');
            let accessToken = data["access"];
            accessCookieTimeout = 60*60; // For 1 hour
            let refreshToken = data["refresh"];
            refreshCookieTimeout = 60*60*24; // For 1 Day
            
            const accessCookie = `access=${accessToken}; path=/; max-age=${accessCookieTimeout}`;
            const refreshCookie = `refresh=${refreshToken}; path=/; max-age=${refreshCookieTimeout}`;
            
            document.cookie = accessCookie;
            document.cookie = refreshCookie;
            
            window.location.href = `http://${BASE_URL}:${BACKEND_PORT}${USER_PAGE}`;
        } else {
            console.error('Login Failed : ', data);
            raiseError('Login Failed : ', data);
            // throw new Error('Login Failed : ', data);
        }
    } catch (error) {
        loginErr = "There was an error during login. Please try again...";
        raiseError(loginErr);
    }
}

// Function to get the cookie value of `cname` cookie 
function getCookieValue(cname) {
    let cookieLookup = cname+"=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let splitCookies = decodedCookie.split(';');
    for (let i = 0; i < splitCookies.length; i++) {
        if (splitCookies[i].indexOf(cookieLookup) != -1) {
            let cvalue = splitCookies[i].split('=')[1];
            return cvalue;
        }
    }
    throw new Error('Cookie Not Found');
}

// Function to login the user if token is present
function loginWithToken() {
    try {
        if (getCookieValue(REFRESH_COOKIE)) {
            console.log('Atleast refresh token is present. Loging user in...')
            window.location.href = `http://${BASE_URL}:${BACKEND_PORT}${USER_PAGE}`;
        }
    } catch (error) {
        console.log('Refresh token not found. User needs to login')
    }
}

// Function to get Access Token from Refresh
function getTokenFromRefresh() {

}

// Adding Event Listener to form's submit button
loginButton.addEventListener("click", login);

document.addEventListener("DOMContentLoaded", loginWithToken);
