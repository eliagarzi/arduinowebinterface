let arduinoStore = {
    1234: {
        "element": "gur",
        "temp": 12,
    }
}

let currentArdunio;

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

function closeAllMenus() {
    for(e in allMenus) {
        allMenus[e].style.display = "none";    }
    backgroundHide.style.display = "none";
    currentArdunio = null;
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

document.addEventListener("onload", () => {
    //Init Websocket 
    //Alle Ardunios und Daten ziehen
})