import { ACCESS_COOKIE, BASE_URL, BACKEND_PORT, LOGIN_PAGE } from "./config.js"
import { getCookieValue, getRoomByID, getSlotByID } from "./apiService.js"

/**
 * Utility functions for UI creation and manipulation
 */

/**
 * Creates a form element with the specified form elements
 * @param {Object} elementList - Object containing form element configurations
 * @param {HTMLElement} container - Container element to append the form to
 * @returns {HTMLFormElement} The created form element
 */
export function createForm(elementList, container = null) {
    // Create form object
    let newForm = document.createElement('form');
    
    for (const key in elementList) {
        if (Object.hasOwn(elementList[key], "label")) { // Creating label for the element
            const newLabel = document.createElement('label');
            if (Object.hasOwn(elementList[key], "textContent")) newLabel.textContent = elementList[key].textContent;
            if (Object.hasOwn(elementList[key], "htmlFor")) newLabel.htmlFor = elementList[key].htmlFor;
            if (Object.hasOwn(elementList[key], "classList")) {
                if (typeof elementList[key].classList === 'string') newLabel.classList.add(elementList[key].classList);
                else newLabel.classList.add(...elementList[key].classList);
            }
            newForm.appendChild(newLabel);
        } else { // Creating Input for the element
            let newInput;
            if (Object.hasOwn(elementList[key], "type") && elementList[key].type == "select") {
                newInput = document.createElement('select');
                const initialOption = Object.assign(document.createElement("option"), {
                    disabled : true,
                    selected : true,
                    value : "",
                });
                newInput.appendChild(initialOption);
            } else {
                newInput = document.createElement('input');
                if (Object.hasOwn(elementList[key], "type")) newInput.type = elementList[key].type;
            }
            if (Object.hasOwn(elementList[key], "name")) newInput.name = elementList[key].name;
            if (Object.hasOwn(elementList[key], "id")) newInput.id = elementList[key].id;
            if (Object.hasOwn(elementList[key], "value")) newInput.value = elementList[key].value;
            if (Object.hasOwn(elementList[key], "autoComplete")) newInput.autocomplete = elementList[key].autoComplete;
            if (Object.hasOwn(elementList[key], "classList")) {
                if (typeof elementList[key].classList === 'string') newInput.classList.add(elementList[key].classList);
                else newInput.classList.add(...elementList[key].classList);
            }
            if (Object.hasOwn(elementList[key], "required")) newInput.required = true;
            newForm.appendChild(newInput);
        }
    }

    // If container is provided, empty it and add the form
    if (container) clearAndAppend(container, newForm);
    
    return newForm;
}

/**
 * Creates a table element with the specified data and functionality
 * @param {Object} tableObj - Object containing table configuration
 * @param {Map} hiddenData - Contains Map of Attributes to hide from user
 * @param {Array} tableObj.data - Array of data objects to display
 * @param {Array} tableObj.classList - CSS classes to apply to the table
 * @param {Object} tableObj.functions - Object containing button functions for each row
 * @returns {HTMLTableElement} The created table element
 */
export function createTable(tableObj, hiddenData) {
    try {
        let newTable = document.createElement('table');
        newTable.classList.add(...tableObj.classList);
        let newTableBody = document.createElement('tbody');

        if (tableObj.data.length > 0) {
            // Create table header
            let headerRow = document.createElement('tr');
            for (const key in tableObj.data[0]) {
                if (hiddenData.get(key) == null) {
                    let headerCell = document.createElement('th');
                    headerCell.textContent = key.toUpperCase().replace('_', ' ');
                    headerRow.appendChild(headerCell);
                }
            }
            newTableBody.appendChild(headerRow);

            // Create table rows
            for (const item of tableObj.data) {
                let dataRow = document.createElement('tr');
                dataRow.dataset.objID = item.id;
                for (const key in item) {
                    if (hiddenData.get(key) == null) {
                        let dataCell = document.createElement('td');
                        dataCell.textContent = item[key];
                        dataRow.appendChild(dataCell);
                    }
                }
                
                // Adding Functionality
                for (const funcKey in tableObj.functions) {
                    let newButtonCell = document.createElement('td');
                    let newButton = document.createElement('button');
                    newButton.textContent = tableObj.functions[funcKey].textContent;
                    if (typeof tableObj.functions[funcKey].classList === 'string') {
                        newButton.classList.add(tableObj.functions[funcKey].classList);
                    } else {
                        newButton.classList.add(...tableObj.functions[funcKey].classList);
                    }
                    newButton.addEventListener("click", () => tableObj.functions[funcKey].handlerFunc(dataRow.dataset.objID));
                    newButtonCell.append(newButton);
                    dataRow.appendChild(newButtonCell);
                }
                newTableBody.appendChild(dataRow);
            }
        }
        newTable.appendChild(newTableBody); // Appending table body to table
        return newTable;
    } catch(error) {
        throw new Error(`Error in creating Table : ${error.message}`);
    }
}

/**
 * Creates a button element with specified properties
 * @param {Object} buttonConfig - Configuration object for the button
 * @param {string} buttonConfig.text - Button text
 * @param {Array|string} buttonConfig.classList - CSS classes to apply
 * @param {Function} buttonConfig.clickHandler - Click event handler
 * @param {Object} buttonConfig.attributes - Additional attributes to set
 * @returns {HTMLButtonElement} The created button element
 */
export function createButton(buttonConfig) {
    const button = document.createElement('button');
    
    if (buttonConfig.text) {
        button.textContent = buttonConfig.text;
    }
    
    if (buttonConfig.classList) {
        if (typeof buttonConfig.classList === 'string') {
            button.classList.add(buttonConfig.classList);
        } else {
            button.classList.add(...buttonConfig.classList);
        }
    }
    
    if (buttonConfig.clickHandler) {
        button.addEventListener('click', buttonConfig.clickHandler);
    }
    
    if (buttonConfig.attributes) {
        for (const [key, value] of Object.entries(buttonConfig.attributes)) {
            button.setAttribute(key, value);
        }
    }
    
    return button;
}

/**
 * Clears the content of a container and optionally appends new elements
 * @param {HTMLElement} container - Container element to clear
 * @param {HTMLElement|Array<HTMLElement>} newElements - Element(s) to append after clearing
 */
export function clearAndAppend(container, newElements = null) {
    container.innerHTML = "";
    
    if (newElements) {
        if (Array.isArray(newElements)) {
            newElements.forEach(element => container.appendChild(element));
        } else {
            container.appendChild(newElements);
        }
    }
}


export let bookingTableObj = {
    data : null,
    functions: [
    {
        textContent: 'Delete',
        classList: ["btn", "btn-danger"],
        handlerFunc: handleDeleteBooking,
    }
    ],
    classList : ["main-table"],
}

async function handleDeleteBooking(bookingID) {
    console.log(bookingID);
    await deleteBooking(bookingID);
}

/**
 * @param {String} bookingID - ID of the Booking to delete
 */
async function deleteBooking(bookingID) {
    let accessToken = getCookieValue(ACCESS_COOKIE);
    if (!accessToken) {
        // TODO: Fix the flow to create token (from refresh) inplace
        console.log(`accessToken not found. Redirecting to login`);
        window.location.href = `http://${BASE_URL}:${BACKEND_PORT}${LOGIN_PAGE}`;
    }
    const resp = await deleteBookingByID(bookingID, accessToken);
    console.log('Booking Deleted')
    // Display updated bookings list
    await handleDisplayBookings();
}

export let bookingFormObj = {
    "roomLabel" : { // Room Label
        textContent: "Room : ",
        htmlFor: "room",
        classList: "form-label",
        label: "true",
    },
    "RoomInput" : { // Room Input (Dropdown-List Type with all the available rooms)
        type : "select",
        name : "room",
        id : "room",
        classList : "form-control",
        required : "true"
    },
    "timeSlotLabel" : { // Time Slot Label
        textContent: "Time Slot : ",
        htmlFor: "slot",
        classList: "form-label",
        label: "true",
    },
    "TimeSlotInput" : { // Time Slot (Dropdown-List Type with all the time slots available for that specific room)
        type : "select",
        name : "slot",
        id : "slot",
        classList : "form-control",
        required : "true"
    },
    "submit": { // Submit Button
        type : 'submit',
        value : 'Submit',
        classList : ["btn", "btn-primary"],
    }
}

/**
 * @param {HTMLTableElement} bookingTable - Booking Table with raw ids of room and slot
 */
export async function fillBookingTable(bookingTable) {
    try {
        for(let i = 1; i < bookingTable.rows.length; i++) {
            const row = bookingTable.rows[i];
            for(let j = 0; j < row.cells.length-1; j++) { // Skip Delete Button
                const cell = row.cells[j];
                let accessToken = getCookieValue(ACCESS_COOKIE);
                if (!accessToken) {
                    // TODO: Fix the flow to create token (from refresh) inplace
                    console.log(`accessToken not found. Redirecting to login`);
                    window.location.href = `http://${BASE_URL}:${BACKEND_PORT}${LOGIN_PAGE}`;
                }
                if (j % 2 == 0) { // Even are RoomID
                    // Get The Room Details by ID
                    const roomData = await getRoomByID(cell.innerHTML, accessToken);
                    cell.innerHTML = roomData.name;
                } else { // Odd are SlotID
                    // Get the Slot Details by ID
                    const slotData = await getSlotByID(cell.innerHTML, accessToken);
                    cell.innerHTML = `${slotData.start_time}--${slotData.end_time}`;
                }
            }
        }
    } catch(error) {
        console.log(`Error occured in fillBookingTable : ${error.message}`);
    }
}