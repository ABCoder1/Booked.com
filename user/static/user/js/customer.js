import { getCookieValue, getBookingsForUser, createBooking, getAllRooms, getSlotsForRoom, getRoomByID, getSlotByID, deleteBookingByID } from "./apiService.js";
import { ACCESS_COOKIE, BASE_URL, BACKEND_PORT, LOGIN_PAGE } from "./config.js";
import { createTable, createForm, bookingTableObj, bookingFormObj, fillBookingTable } from "./utils.js"

export function renderCustomerUI(customerDiv) {
    mainDiv = customerDiv;

    // Creating Heading for user
    let headingDiv = document.createElement('div');
    headingDiv.classList.add('heading');
    headingDiv.innerText = "Customer Console";
    mainDiv.appendChild(headingDiv);

    // Appending buttons for user access 
    mainDiv.appendChild(getBookingsBttn);
    // mainDiv.appendChild(addBookingBttn);

    // Creating & Appending container for Room Table
    mainDiv.appendChild(mainContainer);
}

/** 
 ** @param {HTMLFormElement} addBookingForm - Form for creating new Booking
*/
async function fillBookingForm(addBookingForm) {
    // Populate the create booking form
    try {
        let accessToken = getCookieValue(ACCESS_COOKIE);
        if (!accessToken) {
            // TODO: Fix the flow to create token (from refresh) inplace
            console.log(`accessToken not found. Redirecting to login`);
            window.location.href = `http://${BASE_URL}:${BACKEND_PORT}${LOGIN_PAGE}`;
        }
        // Get & Populate the Rooms available
        const rooms = await getAllRooms(accessToken);
        rooms.forEach(room => {
            const roomOption = document.createElement('option');
            roomOption.innerHTML = room.name;
            roomOption.value = room.id;
            addBookingForm.elements["room"].appendChild(roomOption);
        });
        // Get & Populate the selected room's slots available
        addBookingForm.elements["room"].addEventListener("change", (e) => populateTimeSlot(e, addBookingForm.elements["slot"]))
    } catch (error) {
        throw new Error(`Error while populating the booking form : ${error.message}`);
    }
}

async function populateTimeSlot(e, slotDropdown) {
    e.preventDefault();
    const roomDropdown = e.target;
    // Populate the time slots for current room
    try {
        let accessToken = getCookieValue(ACCESS_COOKIE);
        if (!accessToken) {
            // TODO: Fix the flow to create token (from refresh) inplace
            console.log(`accessToken not found. Redirecting to login`);
            window.location.href = `http://${BASE_URL}:${BACKEND_PORT}${LOGIN_PAGE}`;
        }
        // Get & Populate the Rooms available
        const slots = await getSlotsForRoom(roomDropdown.value, accessToken);
        slotDropdown.innerHTML="" // Reset Previous Options
        slots.forEach(slot => {
            const slotOption = document.createElement('option');
            slotOption.innerHTML = `${slot.start_time}--${slot.end_time}`;
            slotOption.value = slot.id;
            slotDropdown.appendChild(slotOption);
        });
    } catch (error) {
        throw new Error(`Error while populating the time slots for current room : ${error.message}`);
    }
}



// -----------Handler Functions-----------

async function handleDisplayBookings() {
    try {
        let accessToken = getCookieValue(ACCESS_COOKIE);
        if (!accessToken) {
            // TODO: Fix the flow to create token (from refresh) inplace
            console.log(`accessToken not found. Redirecting to login`);
            window.location.href = `http://${BASE_URL}:${BACKEND_PORT}${LOGIN_PAGE}`;
        }
        // Fetch Bookings for the user from backend
        const customerID = sessionStorage.getItem("user_id");
        const bookingsData = await getBookingsForUser(customerID, accessToken);
        bookingTableObj.data = bookingsData;
        let hiddenData = new Map();
        hiddenData.set("id", 1);
        hiddenData.set("customer", 1);
        const bookingTable = createTable(bookingTableObj, hiddenData);
        await fillBookingTable(bookingTable);
        mainContainer.innerHTML = ""; // Emptying the current content of the div
        mainContainer.appendChild(bookingTable); // Appending table to div
        mainContainer.appendChild(addBookingBttn);
    } catch(error) {
        console.log(`Error occured in handleDisplayBookings : ${error.message}`);
    }
}



async function handleAddBooking() {
    const addBookingForm = createForm(bookingFormObj, mainContainer);
    await fillBookingForm(addBookingForm);
    addBookingForm.addEventListener("submit", addBooking);
}

// -----------Client Functions-----------

async function addBooking(e) {
    e.preventDefault();
    try {
        const bookingData = new FormData(e.target);
        const bookingObj = Object.fromEntries(bookingData.entries());
        let accessToken = getCookieValue(ACCESS_COOKIE);
        if (!accessToken) {
            // TODO: Fix the flow to create token (from refresh) inplace
            console.log(`accessToken not found. Redirecting to login`);
            window.location.href = `http://${BASE_URL}:${BACKEND_PORT}${LOGIN_PAGE}`;
        }
        const customerID = sessionStorage.getItem("user_id");
        bookingObj["customer"] = customerID;
        const resp = await createBooking(bookingObj, accessToken);
        console.log('Booking Created')
        // Display updated bookings list
        await handleDisplayBookings();
    } catch(error) {
        console.log(`Error occured while creating booking : ${error.message}`)
    }
}

let mainDiv;
let mainContainer = document.createElement('div');
mainContainer.classList.add('main-container');

const getBookingsBttn = document.createElement('button')
getBookingsBttn.innerText = "Get Bookings";
getBookingsBttn.classList.add("btn", "btn-info");

const addBookingBttn = document.createElement('button')
addBookingBttn.innerText = "Create Booking";
addBookingBttn.classList.add("btn", "btn-info");

getBookingsBttn.addEventListener("click", handleDisplayBookings);
addBookingBttn.addEventListener("click", handleAddBooking);