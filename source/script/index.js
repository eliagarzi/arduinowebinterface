const newArdunioButton = document.querySelector(".header-element__new-arduino-button");
const newArduinoMenu = document.querySelector(".new-arduino-menu");
const newArduinoMenuBlur = document.querySelector(".new-arduino-menu--blur");

//Wenn auf den New Arduino Button gedrückt wird, wird das Fenster geöffnet
newArdunioButton.addEventListener("click", function(){
    newArduinoMenuBlur.style.display = "block"
    newArduinoMenu.style.display = "block";
})


//Wenn ausserhalb des Menüs gedrückt wird, wird das Fenster geschlossen
newArduinoMenuBlur.addEventListener("click", function() {
    newArduinoMenuBlur.style.display = "none"
    newArduinoMenu.style.display = "none";
})

const arduinoFormsSubmitButton = document.querySelector(".new-arduino-submit-button");
const arduinoForms = document.querySelector(".new-arduino-menu__forms");

arduinoForms.addEventListener("submit", (e) => {

    //Fetch request to api 


    e.preventDefault();
})


