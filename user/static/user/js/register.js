import {BASE_URL, BACKEND_PORT, LOGIN_PAGE} from "./config.js";
import {generateToken, validateForm, createUser, setTokenCookie} from "./apiService.js"

let registerForm = document.forms["register-form"];
let validationErrors = document.querySelector("#validation-errors");

// Function for User Registration
async function register(e) {
    e.preventDefault();

    // Validate user data
    validateForm(registerForm, validationErrors);

    const formdata = new FormData(registerForm);
    const [firstName, lastName] =  formdata.get("name").split(' ');
    const password = formdata.get("password");
    const type = formdata.get("user_type") == "customer" ? `CUSTOMER` : `ROOM_MANAGER`;
    const username = formdata.get("username");
    const email = formdata.get("email");
    const phone_number = formdata.get("phone_number");

    try {
        const userData = {"first_name": firstName, "last_name": lastName, "username": username, "type": type, "email": email, "password": password, "phone_number": phone_number};
        const userResponse = await createUser(userData);
        console.log('Registeration Successful');

        const tokenData = await generateToken(username, password);

        setTokenCookie(tokenData);
    
        console.log('Successfully set tokens in cookies')

        window.location.href = `http://${BASE_URL}:${BACKEND_PORT}${LOGIN_PAGE}`;

    } catch (error) {
        console.log('Error occured while creating user : ', error);  
    }
}

registerForm.addEventListener('submit', register);