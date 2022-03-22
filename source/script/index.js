

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

function renderWebstreamContent() {

    //Build Websocket Stream
    //Parse String into JSON

    const ardunioObj = JSON.parse('{"name": "ardunio1","temp": 22,"token": "JWT24BA"}');

    const arrayOfArdunioObj = [""];

    for(let i = 0; i < arrayOfArdunioObj.length; i++) {
        
        //New Table Row Element 
        //for each Element in JSON a th tag 
        let tableRow = document.createElement("tr");
        
        for (element in ardunioObj) {
            let tableRowData = document.createElement("td");
            tableRowData.textContent = ardunioObj[element];
            tableRow.appendChild(tableRowData);
        } 

    }
}

function checkAPIConnection() {
    fetch("http://127.0.0.1:3000/ap")
    .then(response => {
        if (response.ok) {
            console.log("Looks Good");
        } else {
            throw new Error("Error")
        }
    })
    .catch((err, response) => { console.log("Problem " + response.status)})
}

window.addEventListener("load", () => {
    checkAPIConnection();
});






