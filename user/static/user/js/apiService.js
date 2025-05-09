import {BASE_URL, BACKEND_PORT, USER_ENDPOINT, TOKEN_ENDPOINT,  ACCESS_COOKIE, REFRESH_COOKIE} from "./config.js"

// Function to save key-values in sessionStorage
export function setSessionStorage(pairs) {
    for (const key in pairs) {
        if (pairs.hasOwnProperty(key)) {
            sessionStorage.setItem(key, pairs[key]);
        }
    }
}

// Function to set cookies
export function setCookies(cookies) {
    for (const key in cookies) {
        if (cookies.hasOwnProperty(key)) {
            document.cookie = `${key}=${cookies[key].value}; path=/; max-age=${cookies[key].timeout}`;
        }
    }
}

// Function to get the cookie value of `cname` cookie 
export function getCookieValue(cname) {
    let cookieLookup = cname+"=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let splitCookies = decodedCookie.split(';');
    for (let i = 0; i < splitCookies.length; i++) {
        if (splitCookies[i].indexOf(cookieLookup) != -1) {
            let cvalue = splitCookies[i].split('=')[1];
            return cvalue;
        }
    }
    return null
}

// Generic Function to make api calls
async function fetchData(endpoint, method = "GET", body = null, headers = {}) {
    try {
        const response = await fetch(`http://${BASE_URL}:${BACKEND_PORT}${endpoint}`, {
            method: method,
            headers: headers,
            body: body != null ? JSON.stringify(body) : null
        })

        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(`Invalid Response : ${JSON.stringify(data)}`);
        }
    } catch (error) {
        throw new Error(`API Error: ${error.message}`)
    }
}

// Function to get user by ID
export async function getUserByID(accessToken, userID) {
    try {
        // const userID = sessionStorage.getItem('user_id');
        const headers = {Authorization: `Bearer ${accessToken}`};
        const data = await fetchData(`${USER_ENDPOINT}${userID}/`, "GET", null, headers);
        return data;
    } catch (error) {
        throw new Error(`Couldn't get user from id : ${error.message}`);
    }
}

// Function to get Access & Refresh Token for user
export async function generateToken(username, password) {
    try {
        const headers = {'Content-Type': 'application/json', 'X-CSRFToken': csrftoken};
        const body = {"username": username,"password": password};
        const data = await fetchData(TOKEN_ENDPOINT, "POST", body, headers);
        return data;
    } catch (error) {
        throw new Error(`Error in generating Token : ${error.message}`);
    }
}

// Function to get Access Token from Refresh
export async function getTokenFromRefresh(refreshToken) {
    try {
        const headers = {'Content-Type': 'application/json', 'X-CSRFToken': csrftoken};
        const body = {"refresh": refreshToken};
        const data = await fetchData(`${TOKEN_ENDPOINT}refresh/`, "POST", body, headers);
        return data;
    } catch (error) {
        throw new Error(`Error in generating access Token from refresh : ${error.message}`);
    }
}

// Function to create user
export async function createUser(userData) {
    try {
        const headers ={'Content-Type': 'application/json', 'X-CSRFToken': csrftoken}
        let data = await fetchData(USER_ENDPOINT, "POST", userData, headers);
        return data;
    } catch (error) {
        throw new Error(`Error in creating user : ${error.message}`);
    }
}

// Function to perform frontend validation of form values
export function validateForm(form) {
    const formdata = new FormData(form);
    const username = formdata.get("username");
    const password = formdata.get("password");
    const invalidRegex = /[^_a-zA-Z0-9@.]/;
    
    if (invalidRegex.test(username)) { // Invalid Username
        const errText = "Invalid Username. Try Again !";
        // raiseError(errText);
        throw new Error(`Validation Error : ${errText}`);
    }
}

// Function to raise errors in validation block
export function raiseError(errText, validationErrors) {
    const errBlock = document.createElement('p');
    errBlock.textContent = errText;
    validationErrors.appendChild(errBlock);
}

let accessCookieTimeout = 60*60;
let refreshCookieTimeout = 60*60*24;
// // Cookies to remove
// let cookies = {
//     [ACCESS_COOKIE]: {
//         value: null,
//         timeout: ,
//     },
//     [REFRESH_COOKIE]: {
//         value: null,
//         timeout: 
//     }
// };

// Function to set tokens in cookie
export function setTokenCookie(tokenData) {
    try {
        let cookies = {};
        if (tokenData[ACCESS_COOKIE]) {
            cookies[ACCESS_COOKIE] = {
                value: tokenData[ACCESS_COOKIE],
                timeout: accessCookieTimeout,
            }
        }
        if (tokenData[REFRESH_COOKIE]) {
            cookies[REFRESH_COOKIE] = {
                value: tokenData[REFRESH_COOKIE],
                timeout: refreshCookieTimeout,
            }
        }
        if (Object.keys(cookies).length > 0) setCookies(cookies);
    } catch (error) {
        throw new Error(`Error in setting cookie : ${error.message}`);
    }
}

export function removeCookie() {
    try {
        let cookies = {};
        if (getCookieValue(ACCESS_COOKIE)) {
            cookies[ACCESS_COOKIE] = {
                timeout: -1,
            }
        }
        if (getCookieValue(REFRESH_COOKIE)) {
            cookies[REFRESH_COOKIE] = {
                timeout: -1,
            }
        }
        if (Object.keys(cookies).length > 0) setCookies(cookies);
    } catch (error) {
        throw new Error(`Error in removing cookie : ${error.message}`);
    }
}