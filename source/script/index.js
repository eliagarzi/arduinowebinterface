const newArdunioButton = document.querySelector(".header-element__new-arduino-button");
const newArduinoMenu = document.querySelector(".new-arduino-menu");
const newArduinoMenuBlur = document.querySelector(".new-arduino-menu--blur");

//Wenn auf den New Arduino Button gedrückt wird, wird das Fenster geöffnet
newArdunioButton.addEventListener("click", function(){
    newArduinoMenuBlur.style.display = "block"
    newArduinoMenu.style.display = "block";
});

//Wenn ausserhalb des Menüs gedrückt wird, wird das Fenster geschlossen
newArduinoMenuBlur.addEventListener("click", function() {
    newArduinoMenuBlur.style.display = "none"
    newArduinoMenu.style.display = "none";
});

const newArduinoForm = document.querySelector(".new-arduino-menu__forms");
const newArduinoFormDownloadButton = document.querySelector(".new-arduino-menu__forms--downloadconfig");
const newArduinoFormName = document.querySelector(".new-arduino-menu__forms-name");

newArduinoForm.addEventListener("click", (e) => {

    /*
    searchpattern = abhängig von der DB
    */

    if (newArduinoFormName === "" || newArduinoFormName.value.search(/searchpattern/gi)) {



        e.preventDefault();
    } else {
    }
});

const arduinoTable = document.querySelector(".arduino-table");

async function fetchArduinoData(url) {
    try {
        const reponse = await fetch(url, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        });
        if (reponse.ok) {
            const arduinoData = await reponse.json();
            renderArdunioData(arduinoData);
        } else {
            throw new Error();
        }
    } catch (error) {
        console.error(error)
    }   
}

function renderArdunioData(arduinoFetchObjects) {
    const ardtable = document.querySelector(".arduino-table");

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

    //Error on initial fetch
    
});