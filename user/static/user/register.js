const BASE_URL = "127.0.0.1";
const BACKEND_PORT = "8000";
const REGISTER_ENDPOINT = "/api/user/";
const TOKEN_ENDPOINT = "/api/token/";
const USER_LOGIN = "/login"
const ACCESS_COOKIE = "access";
const MANAGER_TYPE = "ROOM_MANAGER";
const CUSTOMER_TYPE = "CUSTOMER";

let registerForm = document.forms["register-form"];
let validationErrs = document.querySelector("#validation-errors");

// This function performs a frontend validation of the values passed from user to backend
function validateForm() {
    const formdata = new FormData(registerForm);
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
    validationErrs.appendChild(errBlock);
}

// Function for Token Generation
async function generateToken(username, password) {
    try {
        const response = await fetch(`http://${BASE_URL}:${BACKEND_PORT}${TOKEN_ENDPOINT}`, {
            method: "POST",
            headers:{
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({username:username, password:password})
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            console.log('Token Generation Successful');
            let accessToken = data["access"];
            accessCookieTimeout = 60*60; // For 1 hour
            let refreshToken = data["refresh"];
            refreshCookieTimeout = 60*60*24; // For 1 Day
            
            const accessCookie = `access=${accessToken}; path=/; max-age=${accessCookieTimeout}`;
            const refreshCookie = `refresh=${refreshToken}; path=/; max-age=${refreshCookieTimeout}`;
            
            document.cookie = accessCookie;
            document.cookie = refreshCookie;
        } else {
            console.log('Token Generation Failed : ', data);
            throw new Error('Token Generation Failed : ', data);
        }
    } catch (error) {
        loginErr = "There was an error during login. Please try again...";
        console.log(loginErr);
        raiseError(loginErr);
    }
}

// Function for User Registration
async function register(e) {
    e.preventDefault();

    const formdata = new FormData(registerForm);
    const [firstName, lastName] =  formdata.get("name").split(' ');
    const password = formdata.get("password");
    const type = formdata.get("user_type") == "customer" ? `CUSTOMER` : `ROOM_MANAGER`;
    const username = formdata.get("username");
    const email = formdata.get("email");
    const phone_number = formdata.get("phone_number");

    try {
        let response = await fetch(`http://${BASE_URL}:${BACKEND_PORT}${REGISTER_ENDPOINT}`, {
            method: "POST",
            headers:{
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({"first_name": firstName, "last_name": lastName, "username": username, "type": type, "email": email, "password": password, "phone_number": phone_number})
        });

        let data = await response.json();
        console.log('data : ', data);

        if (response.ok) {
            console.log('Registeration Successful');
            try {
                await generateToken(username, password);
                console.log('redirecting to login')
            } catch (error) {
                console.log('Error in generating Token : ', error)
                raiseError('Registration successful, but there was an issue during automatic login. Please log in.');
            } finally {
                window.location.href = `http://${BASE_URL}:${BACKEND_PORT}${USER_LOGIN}`;
            }
        } else {
            console.log('Login Failed : ', data);
            raiseError(`Registration Failed: ${data.detail || 'An error occurred during registration.'}`);
        }
    } catch (error) {
        console.log('Error occured while creating user : ', error);
        raiseError(`Error occured while creating user : ${error}`);
    }
}

registerForm.addEventListener('submit', register);