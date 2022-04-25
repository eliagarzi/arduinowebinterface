const newArdunioButton = document.querySelector(".header-element__new-arduino-button");
const newArduinoMenu = document.querySelector(".new-arduino-menu");
const submenuBlur = document.querySelector(".submenu--blur");
const confirmArdunioDeleteMenu = document.querySelector(".confirm-ardunio-delete");

//Mehrere Menüs

//Wenn auf den New Arduino Button gedrückt wird, wird das Fenster geöffnet
newArdunioButton.addEventListener("click", function(){
    submenuBlur.style.display = "block"
    newArduinoMenu.style.display = "block";
});

//Wenn ausserhalb des Menüs gedrückt wird, wird das Fenster geschlossen
submenuBlur.addEventListener("click", function() {
    submenuBlur.style.display = "none"
    newArduinoMenu.style.display = "none";
    confirmArdunioDeleteMenu.style.display = "none";
});

const confirmArdunioDeleteForm = document.querySelector(".confirm-ardunio-delete");
const confirmArdunioDeleteInput = document.querySelector(".confirm-ardunio-delete__input");
const confirmArdunioDeleteButton = document.querySelector(".confirm-ardunio-delete__button");
const confirmArdunioDeleteName = document.querySelector(".confirm-ardunio-delete__form");

confirmArdunioDeleteInput.addEventListener("input", (e) => {
    if(confirmArdunioDeleteInput.value === uuidElementID) {
        confirmArdunioDeleteButton.style.backgroundcolor = "green";
        confirmArdunioDeleteButton.addEventListener("click", () => {
            //deleteArdunio(uuidElementID)
            confirmArdunioDeleteForm.style.display = "none";
            submenuBlur.style.display = "none"
        })
    } else {
        e.preventDefault();
        confirmArdunioDeleteButton.style.backgroundcolor = "gray";
    }
})

function confirmDelete(uuidElementID) {
    submenuBlur.style.display = "block";
    confirmArdunioDeleteForm.style.display = "block";
    //confirmArdunioDeleteName.textContent = uuidElementID;
}

let menuArray = [];

function openWindow(windowToOpen) {
    //Close all Menus
    menuArray.forEach((e) => {
        
    })
}


function deleteArdunio(uuidElementID) {
    const currentUUID = uuidElementID;
    if(ok) {

        postArduinoData(`http://127.0.0.1:8080/api/arduino/delete?uuid=${uuidElementID}`)
        .then((response) => response.json())
        .then((data) => {

            const uuidDOMElement = document.querySelector(`.${currentUUID}`);
            const ardunioTableBody = document.querySelector(".ardunio-table-body");
            ardunioTableBody.removeChild(uuidDOMElement);
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

function renderArdunioData(arduinoFetchObjects) {
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