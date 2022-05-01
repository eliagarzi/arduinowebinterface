const newarduinoButton = document.querySelector(".header-element__new-arduino-button");
const newArduinoMenu = document.querySelector(".new-arduino-menu");
const submenuBlur = document.querySelector(".submenu--blur");
const confirmarduinoDeleteMenu = document.querySelector(".confirm-arduino-delete");

//Mehrere Menüs

//Wenn auf den New Arduino Button gedrückt wird, wird das Fenster geöffnet
newarduinoButton.addEventListener("click", function(){
    submenuBlur.style.display = "block"
    newArduinoMenu.style.display = "block";
});

//Wenn ausserhalb des Menüs gedrückt wird, wird das Fenster geschlossen
submenuBlur.addEventListener("click", function() {
    submenuBlur.style.display = "none"
    newArduinoMenu.style.display = "none";
    confirmarduinoDeleteMenu.style.display = "none";
});

const confirmarduinoDeleteForm = document.querySelector(".confirm-arduino-delete");
const confirmarduinoDeleteInput = document.querySelector(".confirm-arduino-delete__input");
const confirmarduinoDeleteButton = document.querySelector(".confirm-arduino-delete__button");
const confirmarduinoDeleteName = document.querySelector(".confirm-arduino-delete__form");

confirmarduinoDeleteInput.addEventListener("input", (e) => {
    if(confirmarduinoDeleteInput.value === uuidElementID) {
        confirmarduinoDeleteButton.style.backgroundcolor = "green";
        confirmarduinoDeleteButton.addEventListener("click", () => {
            //deletearduino(uuidElementID)
            confirmarduinoDeleteForm.style.display = "none";
            submenuBlur.style.display = "none"
        })
    } else {
        e.preventDefault();
        confirmarduinoDeleteButton.style.backgroundcolor = "gray";
    }
})

function confirmDelete(uuidElementID) {
    submenuBlur.style.display = "block";
    confirmarduinoDeleteForm.style.display = "block";
    //confirmarduinoDeleteName.textContent = uuidElementID;
}

let menuArray = [];

function openWindow(windowToOpen) {
    //Close all Menus
    menuArray.forEach((e) => {
        
    })
}


function deletearduino(uuidElementID) {
    const currentUUID = uuidElementID;
    if(ok) {

        postArduinoData(`http://127.0.0.1:8080/api/arduino/delete?uuid=${uuidElementID}`)
        .then((response) => response.json())
        .then((data) => {

            const uuidDOMElement = document.querySelector(`.${currentUUID}`);
            const arduinoTableBody = document.querySelector(".arduino-table-body");
            arduinoTableBody.removeChild(uuidDOMElement);
        })
        .catch((error) => {
            //display error
        })
    } else {

    }
}

//Event
//Delete
//Create

const newArduinoForm = document.querySelector(".new-arduino-menu__forms");
const newArduinoFormDownloadButton = document.querySelector(".new-arduino-menu__forms--downloadconfig");
const newArduinoFormNameInput = document.querySelector(".form-name-input");
const newArduinoFormLocationInput = document.querySelector(".form-location-input");


newArduinoForm.addEventListener("click", (e) => {
    e.preventDefault();
    //searchpattern abhängig von der DB

    if (newArduinoFormName !== "" && newArduinoFormName.value.search(/searchpattern/gi)) {
        postArduinoData("http://127.0.0.1:8080/api/arduino/create",{
            name: newArduinoFormNameInput,
            location: newArduinoFormLocationInput,
            lastseen: "Not fetched"
        }).then((response) => response.json())
        .then((data) => {
            if (data.error) {
                //Display Error
            } else if(data.token) {
                //Display API Key
            }
        })
        .error((error) => {
            console.error(error)
        });
    } else {
        //Display Error
    }
});

async function postArduinoData(url, dataToPOST) {
    try {
        const reponse = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(dataToPOST)
        });
        if (reponse.ok) {
            const arduinoData = await reponse.json();
            //Auf Bestätigung warten
        } else {
            /* Da catch nur Fehler unterhalb Layer 7 abfängt, muss hier genau überprüft werden, ob der response code ausserhalb von 200 ist =>(response.ok).
            */
            throw new Error();
        }
    } catch (error) {
        console.error(error)
    }   
}

async function getArduinoData(url) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'content-type': 'appl ication/json'
            }
        });
        if (response.ok) {
            return response;
        } else {
            /*
            Da catch nur Fehler unterhalb Layer 7 abfängt, muss hier genau überprüft werden, ob der response code ausserhalb von 200 ist =>(response.ok).
            */
            throw new Error();
        }
    } catch (error) {
        console.error(error)
    }   
}

const arduinoTable = document.querySelector(".arduino-table");

function renderarduinoData(arduinoFetchObjects) {
    //Für jedes Element das gelifert wird -> Arduino Objekt 
    arduinoFetchObjects.forEach((arduinoObject) => {

        let tableRow = document.createElement("tr");

        //Loop durch die einzelnen Werte die im Objekt gespeichert sind
        for(element in arduinoObject) {
            let tableRowData = document.createElement("td");
            tableRowData.textContent = arduinoObject[element];
            ardtable.appendChild(tableRow);
            tableRow.appendChild(tableRowData);
        }
    });
}

window.addEventListener("load", () => {

    //Websocket
    /*
   getArduinoData("http://127.0.0.1:4000/api")
   .then((response) => response.json())
   .then((data) => {
       console.log(data)
   }) 

   */
});