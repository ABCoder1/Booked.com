export function renderRoomManagerUI(managerDiv) {
    let headingDiv = document.createElement('div');
    headingDiv.classList.add('heading');
    headingDiv.innerText = "Room Manager Console";
    managerDiv.appendChild(headingDiv);
    let userRooms = document.createElement('table');
    managerDiv.appendChild(userRooms);
}