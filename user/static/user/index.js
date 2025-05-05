import {jwtDecode} from "https://cdn.jsdelivr.net/npm/jwt-decode@4.0.0/+esm";

const BASE_URL = "127.0.0.1";
const BACKEND_PORT = "8000";
const GET_USER = "/api/user/";
const ACCESS_COOKIE = "access";
const MANAGER_TYPE = "ROOM_MANAGER";
const CUSTOMER_TYPE = "CUSTOMER";

let headingDiv = document.querySelector('#headingDiv')

async function getUser(accessToken) {
    try {
        const userID = sessionStorage.getItem('user_id');
        const response = await fetch(`http://${BASE_URL}:${BACKEND_PORT}${GET_USER}${userID}/`, {
            method: 'GET',
            headers: {Authorization: `Bearer ${accessToken}`}
        })
    
        console.log(JSON.stringify(response));
        const data = await response.json();
        
        sessionStorage.setItem('username', data['username']);
        sessionStorage.setItem('type', data['type']);
        return data;
    } catch (error) {
        throw new Error('Could not get user from id :', error);
    }
}

function setUserIDFromToken(token) {
    try {
        if (sessionStorage.getItem('user_id')) {
            console.log('already in storage');
            return;
        }
        const payload = jwtDecode(token);
        sessionStorage.setItem('user_id', payload["user_id"]);
    } catch (error) {
        throw new Error("Error parsing token:", error);
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

// Parsing token from cookie 
self.addEventListener("load", () => {
    try {
        let accessToken = getCookieValue(ACCESS_COOKIE);
        console.log('accessToken :', accessToken);
        setUserIDFromToken(accessToken);
        if (!sessionStorage.getItem('username')) {
            getUser(accessToken).then( (user) => {
                console.log(user);
                let username = sessionStorage.getItem('username');
                let type = sessionStorage.getItem('type');
                createTitle(user["type"]);
            });
        }
        let type = sessionStorage.getItem('type');
        createTitle(type);
        // Functionality for CUSTOMERS
        

        // Functionality for ROOM-MANAGERS

    } catch (error) {
        console.log(error);
    }
});

function createTitle(type) {
    console.log('Inside createTitle');
    console.log('type : ', type)
    if (type == MANAGER_TYPE){
        headingDiv.textContent = `Room Manager Console`;
    } else if (type == CUSTOMER_TYPE) {
        headingDiv.textContent = `Customer Console`;
    } else {
        headingDiv.textContent = `Admin Console`;
    }
}