import { getRoomsForUser, getCookieValue, createRoom, getRoomByID, updateRoom, deleteRoomByID, getSlotsForRoom, createSlot, getSlotByID, updateSlot, deleteSlotByID, getBookingsForUser } from "./apiService.js"
import { ACCESS_COOKIE, BASE_URL, BACKEND_PORT, LOGIN_PAGE } from "./config.js"
import { bookingTableObj, createForm, createTable, fillBookingTable } from "./utils.js"

export function renderRoomManagerUI(managerDiv) {
    mainDiv = managerDiv;
    
    // Creating Heading for user
    let headingDiv = document.createElement('div');
    headingDiv.classList.add('heading');
    headingDiv.innerText = "Room Manager Console";
    mainDiv.appendChild(headingDiv);

    // Appending buttons for user access 
    mainDiv.appendChild(getRoomsBttn);
    mainDiv.appendChild(getBookingsBttn);

    // Creating & Appending container for Room Table
    mainDiv.appendChild(mainContainer);
}

// -----------Handler Functions-----------

async function handleDisplayRooms() {
    try {
        let accessToken = getCookieValue(ACCESS_COOKIE);
        if (!accessToken) {
            // TODO: Fix the flow to create token (from refresh) inplace
            console.log(`accessToken not found. Redirecting to login`);
            window.location.href = `http://${BASE_URL}:${BACKEND_PORT}${LOGIN_PAGE}`;
        }
        // Fetch Rooms for the user from backend
        const managerID = sessionStorage.getItem("user_id");
        const roomsData = await getRoomsForUser(managerID, accessToken);
        roomTableObj.data = roomsData;
        let hiddenData = new Map();
        hiddenData.set("id", 1);
        const roomTable = createTable(roomTableObj, hiddenData);
        mainContainer.innerHTML = ""; // Emptying the current content of the div
        mainContainer.appendChild(roomTable); // Appending table to div
        mainContainer.appendChild(addRoomBttn);
    } catch(error) {
        console.log(`Error occured in handleDisplayRooms : ${error.message}`);
    }
}

async function handleDisplaySlots(roomID) {
    try {
        let accessToken = getCookieValue(ACCESS_COOKIE);
        if (!accessToken) {
            // TODO: Fix the flow to create token (from refresh) inplace
            console.log(`accessToken not found. Redirecting to login`);
            window.location.href = `http://${BASE_URL}:${BACKEND_PORT}${LOGIN_PAGE}`;
        }
        // Fetch Slots for the room from backend
        const slotsData = await getSlotsForRoom(roomID, accessToken);
        timeSlotTableObj.data = slotsData;
        let hiddenData = new Map();
        hiddenData.set("id", 1);
        const slotTable = createTable(timeSlotTableObj, hiddenData);
        mainContainer.innerHTML = ""; // Emptying the current content of the div
        mainContainer.appendChild(slotTable); // Appending table to div
        const addSlotBttn = document.createElement("button");
        addSlotBttn.classList.add("btn", "btn-info");
        addSlotBttn.innerText = "Add Time Slot";
        addSlotBttn.addEventListener("click", () => handleAddSlot(roomID));
        mainContainer.appendChild(addSlotBttn);
    } catch(error) {
        console.log(`Error occured in handleDisplaySlots : ${error.message}`);
    }
}

async function handleAddRoom() {
    const addRoomForm = createForm(roomFormObj, mainContainer);
    addRoomForm.addEventListener("submit", addRoom);
}

async function handleAddSlot(roomID) {
    const addSlotForm = createForm(timeSlotFormObj, mainContainer);
    addSlotForm.addEventListener("submit", (e) => addSlot(e, roomID));
}

async function handleDeleteRoom(roomID) {
    await deleteRoom(roomID);
}

async function handleEditRoom(roomID) {
    try {
        let editRoomForm = createForm(roomFormObj, mainContainer);
        let accessToken = getCookieValue(ACCESS_COOKIE);
        if (!accessToken) {
            // TODO: Fix the flow to create token (from refresh) inplace
            console.log(`accessToken not found. Redirecting to login`);
            window.location.href = `http://${BASE_URL}:${BACKEND_PORT}${LOGIN_PAGE}`;
        }
        // Autofilling form with original values
        const oldRoom = await getRoomByID(roomID, accessToken);
        editRoomForm.elements["name"].value = oldRoom["name"];
        editRoomForm.elements["location"].value = oldRoom["location"];
        editRoomForm.elements["description"].value = oldRoom["description"];
        editRoomForm.elements["waiting_period"].value = oldRoom["waiting_period"];

        editRoomForm.addEventListener("submit", (e) => editRoom(e, roomID));
    } catch (error) {
        throw new Error(`${error.message}`);
    }
}

async function handleEditSlot(slotID) {
    console.log(`inside handleEditSlot`);
    try {
        let editSlotForm = createForm(timeSlotFormObj, mainContainer);
        let accessToken = getCookieValue(ACCESS_COOKIE);
        if (!accessToken) {
            // TODO: Fix the flow to create token (from refresh) inplace
            console.log(`accessToken not found. Redirecting to login`);
            window.location.href = `http://${BASE_URL}:${BACKEND_PORT}${LOGIN_PAGE}`;
        }
        // Autofilling form with original values
        const oldSlot = await getSlotByID(slotID, accessToken);
        editSlotForm.elements["start_time"].value = oldSlot["start_time"];
        editSlotForm.elements["end_time"].value = oldSlot["end_time"];

        editSlotForm.addEventListener("submit", (e) => editSlot(e, slotID));
    } catch (error) {
        throw new Error(`${error.message}`);
    }
}

async function handleDeleteSlot(slotID) {
    console.log(`inside handleDeleteSlot`);
    await deleteSlot(slotID);
}


async function handleTimeSlots(roomID) {
    console.log(`Handling time slots for room ${roomID}`);
    // Setting roomID in sessionStorage until cleared
    sessionStorage.setItem("room_id", roomID);
    await handleDisplaySlots(roomID);
}

async function handleDisplayBookings() {
    try {
        let accessToken = getCookieValue(ACCESS_COOKIE);
        if (!accessToken) {
            // TODO: Fix the flow to create token (from refresh) inplace
            console.log(`accessToken not found. Redirecting to login`);
            window.location.href = `http://${BASE_URL}:${BACKEND_PORT}${LOGIN_PAGE}`;
        }
        // Fetch Bookings for the manager from backend
        const managerID = sessionStorage.getItem("user_id");
        const bookingsData = await getBookingsForUser(managerID, accessToken);
        bookingTableObj.data = bookingsData;
        let hiddenData = new Map();
        hiddenData.set("id", 1);
        hiddenData.set("customer", 1);
        const bookingTable = createTable(bookingTableObj, hiddenData);
        await fillBookingTable(bookingTable);
        mainContainer.innerHTML = ""; // Emptying the current content of the div
        mainContainer.appendChild(bookingTable); // Appending table to div
    } catch(error) {
        console.log(`Error occured in handleDisplayBookings : ${error.message}`);
    }
}

// -----------Client Functions-----------

async function addRoom(e) {
    e.preventDefault();
    try {
        const roomData = new FormData(e.target);
        const roomObj = Object.fromEntries(roomData.entries());
        console.log(roomObj);
        let accessToken = getCookieValue(ACCESS_COOKIE);
        if (!accessToken) {
            // TODO: Fix the flow to create token (from refresh) inplace
            console.log(`accessToken not found. Redirecting to login`);
            window.location.href = `http://${BASE_URL}:${BACKEND_PORT}${LOGIN_PAGE}`;
        }
        const managerID = sessionStorage.getItem("user_id");
        roomObj["manager"] = managerID;
        const resp = await createRoom(roomObj, accessToken);
        console.log('Room Created')
        // Display updated rooms list
        await handleDisplayRooms();
    } catch(error) {
        console.log(`Error occured while adding room : ${error.message}`)
    }
}

async function addSlot(e, roomID) {
    e.preventDefault();
    try {
        const slotData = new FormData(e.target);
        const slotObj = Object.fromEntries(slotData.entries());
        let accessToken = getCookieValue(ACCESS_COOKIE);
        if (!accessToken) {
            // TODO: Fix the flow to create token (from refresh) inplace
            console.log(`accessToken not found. Redirecting to login`);
            window.location.href = `http://${BASE_URL}:${BACKEND_PORT}${LOGIN_PAGE}`;
        }
        slotObj["room"] = roomID;
        const resp = await createSlot(slotObj, accessToken);
        console.log('Time Slot Created')
        // Display updated time slots list
        await handleDisplaySlots(roomID);
    } catch(error) {
        console.log(`Error occured while adding time slot : ${error.message}`)
    }
}

async function editRoom(e, roomID) {
    e.preventDefault();
    console.log(`handling update for room ${roomID}`);
    try {
        const updatedRoomData = new FormData(e.target);
        const roomObj = Object.fromEntries(updatedRoomData.entries());
        let accessToken = getCookieValue(ACCESS_COOKIE);
        if (!accessToken) {
            // TODO: Fix the flow to create token (from refresh) inplace
            console.log(`accessToken not found. Redirecting to login`);
            window.location.href = `http://${BASE_URL}:${BACKEND_PORT}${LOGIN_PAGE}`;
        }
        const resp = await updateRoom(roomID, roomObj, accessToken);
        console.log('Room Updated')
        // Display updated rooms list
        await handleDisplayRooms();
    } catch (error) {
        console.log(`Error occured while updating room : ${error.message}`)
    }
}

async function editSlot(e, slotID) {
    e.preventDefault();
    console.log(`handling update for slot ${slotID}`);
    try {
        const updatedSlotData = new FormData(e.target);
        const slotObj = Object.fromEntries(updatedSlotData.entries());
        let accessToken = getCookieValue(ACCESS_COOKIE);
        if (!accessToken) {
            // TODO: Fix the flow to create token (from refresh) inplace
            console.log(`accessToken not found. Redirecting to login`);
            window.location.href = `http://${BASE_URL}:${BACKEND_PORT}${LOGIN_PAGE}`;
        }
        const resp = await updateSlot(slotID, slotObj, accessToken);
        console.log('Time Slot Updated')
        // Display updated time slots list
        const roomID = sessionStorage.getItem("room_id");
        await handleDisplaySlots(roomID);
    } catch (error) {
        console.log(`Error occured while updating time slot : ${error.message}`)
    }
}

async function deleteRoom(roomID) {
    console.log(`deleting room ${roomID}`);
    try {
        let accessToken = getCookieValue(ACCESS_COOKIE);
        if (!accessToken) {
            // TODO: Fix the flow to create token (from refresh) inplace
            console.log(`accessToken not found. Redirecting to login`);
            window.location.href = `http://${BASE_URL}:${BACKEND_PORT}${LOGIN_PAGE}`;
        }
        const resp = await deleteRoomByID(roomID, accessToken);
        console.log('Room Deleted')
        // Display updated rooms list
        await handleDisplayRooms();
    } catch (error) {
        console.log(`Error occured while deleting room : ${error.message}`)
    }
}

async function deleteSlot(slotID) {
    console.log(`deleting slot ${slotID}`);
    try {
        let accessToken = getCookieValue(ACCESS_COOKIE);
        if (!accessToken) {
            // TODO: Fix the flow to create token (from refresh) inplace
            console.log(`accessToken not found. Redirecting to login`);
            window.location.href = `http://${BASE_URL}:${BACKEND_PORT}${LOGIN_PAGE}`;
        }
        const resp = await deleteSlotByID(slotID, accessToken);
        console.log('Time Slot Deleted')
        // Display updated time slots list
        const roomID = sessionStorage.getItem("room_id");
        await handleDisplaySlots(roomID);
    } catch (error) {
        console.log(`Error occured while deleting time slot : ${error.message}`)
    }
}

// Declarations & Event Handling
var mainDiv;
let mainContainer = document.createElement('div');
mainContainer.classList.add('main-container');

const getRoomsBttn = document.createElement('button')
getRoomsBttn.innerText = "Get Rooms";
getRoomsBttn.classList.add("btn", "btn-info");

const addRoomBttn = document.createElement('button')
addRoomBttn.innerText = "Add Room";
addRoomBttn.classList.add("btn", "btn-info");

const getBookingsBttn = document.createElement('button')
getBookingsBttn.innerText = "Get Bookings";
getBookingsBttn.classList.add("btn", "btn-info");

getRoomsBttn.addEventListener("click", handleDisplayRooms);
getBookingsBttn.addEventListener("click", handleDisplayBookings);
addRoomBttn.addEventListener("click", handleAddRoom);

const roomFormObj = {
    "nameLabel" : {
        textContent: "Name : ",
        htmlFor: "name",
        classList: "form-label",
        label: "true",
    },
    "nameInput" : {
        type : "text",
        name : "name",
        id : "name",
        autoComplete : "on",
        classList : "form-control",
    },
    "locationLabel" : {
        textContent: "Location : ",
        htmlFor: "location",
        classList: "form-label",
        label: "true",
    },
    "locationInput" : {
        type : "text",
        name : "location",
        id : "location",
        classList : "form-control",
    },
    "descriptionLabel" : {
        textContent: "Description : ",
        htmlFor: "description",
        classList: "form-label",
        label: "true",
    },
    "descriptionInput" : {
        type : "text",
        name : "description",
        id : "description",
        classList : "form-control",
    },
    "waitPeriodLabel" : {
        textContent: "Waiting Period :",
        htmlFor: "waiting_period",
        classList: "form-label",
        label: "true",
    },
    "waitPeriodInput" : {
        type : "text",
        name : "waiting_period",
        id : "waiting_period",
        classList : "form-control",
    },
    "submit": {
        type : 'submit',
        value : 'Submit',
        classList : ["btn", "btn-primary"],
    }
}

const timeSlotFormObj = {
    "StartLabel" : {
        textContent: "Start Time : ",
        htmlFor: "start_time",
        classList: "form-label",
        label: "true",
    },
    "StartInput" : {
        type : "time",
        name : "start_time",
        id : "start_time",
        classList : "form-control",
    },
    "EndLabel" : {
        textContent: "End Time : ",
        htmlFor: "end_time",
        classList: "form-label",
        label: "true",
    },
    "EndInput" : {
        type : "time",
        name : "end_time",
        id : "end_time",
        classList : "form-control",
    },
    "submit": {
        type : 'submit',
        value : 'Submit',
        classList : ["btn", "btn-primary"],
    }
}

const roomTableObj = {
    data : null,
    functions : [
    {
        textContent: 'Edit',
        classList: ["btn", "btn-warning"],
        handlerFunc: handleEditRoom,
    },
    {
        textContent: 'Delete',
        classList: ["btn", "btn-danger"],
        handlerFunc: handleDeleteRoom,
    },
    {
        textContent: 'Time Slots',
        classList: ["btn", "btn-info"],
        handlerFunc: handleTimeSlots,
    }
    ],
    classList : ["main-table"],
}

const timeSlotTableObj = {
    data : null,
    functions : [
    {
        textContent: 'Edit',
        classList: ["btn", "btn-warning"],
        handlerFunc: handleEditSlot,
    },
    {
        textContent: 'Delete',
        classList: ["btn", "btn-danger"],
        handlerFunc: handleDeleteSlot,
    }
    ],
    classList : ["main-table"],
}