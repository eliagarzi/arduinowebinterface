let arduinoStore = {
    100200300: {
        "element": "gur",
        "name": "GULP 62",
        "temp": 12,
    }
}

function testApiConnection() {
    
}

let currentArdunioUUID;

const signoutButton = document.querySelector("#button-logout")
const createButton = document.querySelector("#button-create")

signoutButton.addEventListener("click", () => {
    //Signout API Call
});

const backgroundHide = document.querySelector(".background-hide");

backgroundHide.addEventListener("click", () => {
    closeAllMenus();
})

const arduinoCreateMenuCancelButton = document.querySelector("#arduino-create-menu-button-cancel");
const arduinoDeleteMenuCancelButton = document.querySelector("#arduino-delete-menu-button-cancel");
const arduinoChangePropertiesMenuCancelButton = document.querySelector("#arduino-change-properties-menu-button-cancel");

arduinoCreateMenuCancelButton.addEventListener("click", () => {
    closeAllMenus();
})

arduinoDeleteMenuCancelButton.addEventListener("click", () => {
    closeAllMenus();
})

arduinoChangePropertiesMenuCancelButton.addEventListener("click", () => {
    closeAllMenus();
})

const arduinoCreateMenu = document.querySelector("#arduino-create-menu");
const arduinoDeleteMenu = document.querySelector("#arduino-delete-menu");
const arduinoChangePropertiesMenu = document.querySelector("#arduino-change-properties-menu");
const arduinoOptionsMenu = document.querySelector("#arduino-options-menu");

let allMenus = [
    arduinoOptionsMenu,
    arduinoCreateMenu,
    arduinoDeleteMenu,
    arduinoChangePropertiesMenu,
]

const arduinoCreateMenuForm = document.querySelector("#arduino-create-menu__form");
const arduinoDeleteMenuForm = document.querySelector("#arduino-delete-menu__form");
const arduinoChangePropertiesMenuForm = document.querySelector("#arduino-change-properties-menu__form");

function closeAllMenus() {
    for(e in allMenus) {
        allMenus[e].style.display = "none"; 
    }
    arduinoCreateMenuForm.reset();
    arduinoChangePropertiesMenuForm.reset();
    arduinoDeleteMenuForm.reset();
    backgroundHide.style.display = "none";
    currentArdunioUUID = null;
}

function changeMenuState(menuelement) {
    
    closeAllMenus();
   
    if(menuelement.style.display = "none") {
        menuelement.style.display = "block";
        backgroundHide.style.display = "block";
    } else {
        menuelement.style.display = "none";
        menuelement.style.display = "none";
    }
}

function openContextMenu(uuid) {
    currentArdunio = uuid;
    changeMenuState(arduinoOptionsMenu);
}

const arduinoOptionsMenuChangeButton = document.querySelector("#arduino-options-menu-button-change");
const arduinoOptionsMenuDeleteButton = document.querySelector("#arduino-options-menu-button-delete");
const arduinoOptionsMenuCancelButton = document.querySelector("#arduino-options-menu-button-cancel");

arduinoOptionsMenuChangeButton.addEventListener("click", () => {
    changeMenuState(arduinoChangePropertiesMenu);
})

arduinoOptionsMenuDeleteButton.addEventListener("click", () => {
    changeMenuState(arduinoDeleteMenu);
})

arduinoOptionsMenuCancelButton.addEventListener("click", () => {
    closeAllMenus();
})

createButton.addEventListener("click", () => {
    changeMenuState(arduinoCreateMenu);
})

const statusInfo = document.querySelector(".status-info");
const statusInfoMessage = document.querySelector(".status-info");
const statusInfoAnimationSection = document.querySelector(".status-info__animation-section");

function displayLoader(message, error) {
    if(error == true) {
        statusInfo.classList.remove("status-info--animate")
        statusInfo.classList.add("status-info--error")
        statusInfo.style.backgroundcolor = "FF6A6A";
    } else {
        statusInfo.classList.remove("status-info--error")
        statusInfo.classList.add("status-info--animate")
    }
    statusInfo.style.display = "block";
    statusInfoMessage.textContent = message;
}

function hideLoader() {
    statusInfo.style.display = "none";
}

async function sendJSONToBackend(url, JSONData, infoDOMobject, displayMessage) {
    try {
        displayLoader(displayMessage, false);
        const reponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(JSONData)
        })
        hideLoader();
        return reponse;
    } catch (error) {
        displayLoader("Keine Verbindung zum Server!", true);
        console.error(error)
        return error;
    }
}

const arudnioCreateMenuFormName = document.querySelector("[name='new-arduino-name']")
const arudnioCreateMenuFormLocation = document.querySelector("[name='new-arduino-location']")

arduinoCreateMenuForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if(arudnioCreateMenuFormName.value.trim() === "") {
        arudnioCreateMenuFormName.classList.remove("input-outline--green");
        arudnioCreateMenuFormName.classList.add("input-outline--red");
    } else {
        arudnioCreateMenuFormName.classList.remove("input-outline--red");
        arudnioCreateMenuFormName.classList.add("input-outline--green");
    }

    if(arudnioCreateMenuFormLocation.value.trim() === "") {
        arudnioCreateMenuFormLocation.classList.remove("input-outline--green");
        arudnioCreateMenuFormLocation.classList.add("input-outline--red");
    } else {
        arudnioCreateMenuFormLocation.classList.remove("input-outline--red");
        arudnioCreateMenuFormLocation.classList.add("input-outline--green");
    }

    if (arudnioCreateMenuFormName.value.trim() !== "" && arudnioCreateMenuFormLocation.value.trim() !== "") {
        arudnioCreateMenuFormName.classList.remove("input-outline--red");
        arudnioCreateMenuFormLocation.classList.remove("input-outline--red");
        arudnioCreateMenuFormName.classList.add("input-outline--green");
        arudnioCreateMenuFormLocation.classList.add("input-outline--green"); 

        sendJSONToBackend("http://127.0.0.1:3300/api/arduino/create/",
         {name: arudnioCreateMenuFormName, location: arudnioCreateMenuFormLocation, lastseen: "00:00"},
         "Ardunio wird erstellt");
        closeAllMenus();
        arudnioCreateMenuFormName.classList.remove("input-outline--green");
        arudnioCreateMenuFormLocation.classList.remove("input-outline--green");
    }
})

const arduinoDeleteMenuFormNameInput = document.querySelector("[name='delete-arduino-name']");

//arduinoDeleteMenuFormNameInput.addEventListener("")