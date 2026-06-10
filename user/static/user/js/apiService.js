import {BASE_URL, BACKEND_PORT, USER_ENDPOINT, TOKEN_ENDPOINT, ACCESS_COOKIE, REFRESH_COOKIE, USER_ROOMS_ENDPOINT, ROOM_ENDPOINT, ROOM_SLOTS_ENDPOINT, SLOT_ENDPOINT, BOOKING_ENDPOINT} from "./config.js"

let accessCookieTimeout = 60*60;
let refreshCookieTimeout = 60*60*24;

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

/**
 * Generic Function to make api calls
 * @param {string} endpoint - the endpoint to make the api call to
 * @param {string} method - Request method (POST, GET, PUT, DELETE)
 * @param {JSON} body - The request body in JSON format. Not needed in GET & DELETE requests
 * @param {JSON} headers - The request headers for this api call 
 * @returns {Response}
 */
async function fetchData(endpoint, method = "GET", body = null, headers = {}) {
    try {
        const response = await fetch(`http://${BASE_URL}:${BACKEND_PORT}${endpoint}`, {
            method: method,
            headers: headers,
            body: body != null ? JSON.stringify(body) : null
        })

        if (response.ok) {
            const contentType = response.headers.get("Content-Type");
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                return data;
            } else return null; // If non JSON response, then return null
        } else {
            throw new Error(`Invalid Response : ${JSON.stringify(response)}`);
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

// Function to get rooms for a user
export async function getRoomsForUser(userID, accessToken) {
    try {
        const headers ={Authorization: `Bearer ${accessToken}`}
        let data = await fetchData(`${USER_ENDPOINT}${userID}/room`, "GET", null, headers);
        return data;
    } catch (error) {
        throw new Error(`Error in fetching rooms for user : ${error.message}`);
    }
}

// Function to get all rooms available
export async function getAllRooms(accessToken) {
    try {
        const headers ={Authorization: `Bearer ${accessToken}`}
        let data = await fetchData(`${ROOM_ENDPOINT}`, "GET", null, headers);
        return data;
    } catch (error) {
        throw new Error(`Error in fetching all available rooms: ${error.message}`);
    }
}

// Function to get bookings for a user
export async function getBookingsForUser(userID, accessToken) {
    try {
        const headers ={Authorization: `Bearer ${accessToken}`}
        let data = await fetchData(`${USER_ENDPOINT}${userID}/booking`, "GET", null, headers);
        return data;
    } catch (error) {
        throw new Error(`Error in fetching bookings for user : ${error.message}`);
    }
}

// Function to get time slots for a room
export async function getSlotsForRoom(roomID, accessToken) {
    try {
        const headers ={Authorization: `Bearer ${accessToken}`}
        let data = await fetchData(`${ROOM_ENDPOINT}${roomID}/slot`, "GET", null, headers);
        return data;
    } catch (error) {
        throw new Error(`Error in fetching rooms for user : ${error.message}`);
    }
}

// Function to get room by ID
export async function getRoomByID(roomID, accessToken) {
    try {
        const headers = {Authorization: `Bearer ${accessToken}`};
        const data = await fetchData(`${ROOM_ENDPOINT}${roomID}/`, "GET", null, headers);
        return data;
    } catch (error) {
        throw new Error(`Couldn't get room from id : ${error.message}`);
    }
}

// Function to get time slot by ID
export async function getSlotByID(slotID, accessToken) {
    try {
        const headers = {Authorization: `Bearer ${accessToken}`};
        const data = await fetchData(`${SLOT_ENDPOINT}${slotID}/`, "GET", null, headers);
        return data;
    } catch (error) {
        throw new Error(`Couldn't get slot from id : ${error.message}`);
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

// Function to create room
export async function createRoom(roomData, accessToken) {
    try {
        const headers ={'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}`}
        let data = await fetchData(ROOM_ENDPOINT, "POST", roomData, headers);
        return data;
    } catch (error) {
        throw new Error(`Error in creating room : ${error.message}`);
    }
}

// Function to create time slot for a room
export async function createSlot(slotData, accessToken) {
    try {
        const headers ={'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}`}
        let data = await fetchData(SLOT_ENDPOINT, "POST", slotData, headers);
        return data;
    } catch (error) {
        throw new Error(`Error in creating time slot : ${error.message}`);
    }
}

// Function to create booking for a user
export async function createBooking(bookingData, accessToken) {
    try {
        const headers ={'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}`}
        let data = await fetchData(BOOKING_ENDPOINT, "POST", bookingData, headers);
        return data;
    } catch (error) {
        throw new Error(`Error in creating booking : ${error.message}`);
    }
}

// Function to update room
export async function updateRoom(roomID, roomData, accessToken) {
    try {
        const headers ={'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}`}
        let data = await fetchData(`${ROOM_ENDPOINT}${roomID}/`, "PUT", roomData, headers);
        return data;
    } catch (error) {
        throw new Error(`Error in updating room : ${error.message}`);
    }
}

// Function to update time slot
export async function updateSlot(slotID, slotData, accessToken) {
    try {
        const headers ={'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}`}
        let data = await fetchData(`${SLOT_ENDPOINT}${slotID}/`, "PUT", slotData, headers);
        return data;
    } catch (error) {
        throw new Error(`Error in updating time slot : ${error.message}`);
    }
}

// Function to delete room
export async function deleteRoomByID(roomID, accessToken) {
    try {
        const headers ={'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}`}
        let data = await fetchData(`${ROOM_ENDPOINT}${roomID}/`, "DELETE", null, headers);
        return data;
    } catch (error) {
        throw new Error(`Error in deleting room : ${error.message}`);
    }
}

// Function to delete time slot
export async function deleteSlotByID(slotID, accessToken) {
    try {
        const headers ={'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}`}
        let data = await fetchData(`${SLOT_ENDPOINT}${slotID}/`, "DELETE", null, headers);
        return data;
    } catch (error) {
        throw new Error(`Error in deleting time slot : ${error.message}`);
    }
}

// Function to delete booking
export async function deleteBookingByID(bookingID, accessToken) {
    try {
        const headers ={'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}`}
        let data = await fetchData(`${BOOKING_ENDPOINT}${bookingID}/`, "DELETE", null, headers);
        return data;
    } catch (error) {
        throw new Error(`Error in deleting booking : ${error.message}`);
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