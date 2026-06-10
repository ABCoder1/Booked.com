import { jwtDecode } from "https://cdn.jsdelivr.net/npm/jwt-decode@4.0.0/+esm";
import { ACCESS_COOKIE, MANAGER_TYPE, CUSTOMER_TYPE, BASE_URL, BACKEND_PORT, LOGIN_PAGE } from "./config.js"
import { getCookieValue, getUserByID, setSessionStorage, removeCookie } from "./apiService.js";
import { renderCustomerUI } from "./customer.js";
import { renderRoomManagerUI } from "./room_manager.js";

let customerDiv = document.querySelector('#customerDiv')
let managerDiv = document.querySelector('#managerDiv')
let logoutBttn = document.querySelector('#logout')

// Function to set user_id in sessionStorage
function setUserIDFromToken(token) {
    try {
        if (sessionStorage.getItem('user_id')) {
            console.log('userID already in storage');
            return;
        }
        const payload = jwtDecode(token);
        sessionStorage.setItem('user_id', payload["user_id"]);
        return payload["user_id"];
    } catch (error) {
        throw new Error(`Error parsing token: ${error.message}`);
    }
}

// Loading User Page
self.addEventListener("load", async () => {
    try {
        let accessToken = getCookieValue(ACCESS_COOKIE);
        if (accessToken) {
            console.log('accessToken Found');
            let userID = setUserIDFromToken(accessToken);
            if (!sessionStorage.getItem('username')) {
                const userData = await getUserByID(accessToken, userID);
                // Setting user info in sessionStorage
                setSessionStorage({'username': userData['username'], 'type': userData['type']});
            }
            let type = sessionStorage.getItem('type');
            if (type == CUSTOMER_TYPE) { // Functionality for CUSTOMERS
                managerDiv.setAttribute("display", "none");
                renderCustomerUI(customerDiv);
            } else if (type == MANAGER_TYPE) { // Functionality for ROOM-MANAGERS
                customerDiv.setAttribute("display", "none");
                renderRoomManagerUI(managerDiv);
            } else { // Reinitiate the login
                customerDiv.setAttribute("display", "none");
                managerDiv.setAttribute("display", "none");
                logout();
            }
        } else {
            console.log(`accessToken not found. Redirecting to login`);
            window.location.href = `http://${BASE_URL}:${BACKEND_PORT}${LOGIN_PAGE}`;
        }
    } catch (error) {
        console.error(`Error occured while loading user page : ${error.message}`);
    }
});

// Function to logout the user
function logout() {
    try{
        sessionStorage.clear();
        removeCookie();
        window.location.href = `http://${BASE_URL}:${BACKEND_PORT}${LOGIN_PAGE}`;
    } catch (error) {
        console.log(`Error in logout : ${error.message}`);
    }
}

logoutBttn.addEventListener("click", logout);