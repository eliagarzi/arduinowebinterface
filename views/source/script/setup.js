const setupForms = document.querySelector(".login-form");
const formsSubmitButton = document.querySelector(".form-element__submit-button");

const formElementPassword = document.querySelector(".form-element__input--password");
const formsElementEmail = document.querySelector(".form-element__input--email");
const formsElementPasswordRepeat = document.querySelector(".form-element__input--password--repeat");

const inputvalues = [
    emailElement = formsElementEmail,
    emailValue = formsElementEmail.value.trim(),
    passwordElement = formsElementPassword,
    passwordValue = formsElementPassword.value.trim(),
    passwordRepeatElement = formsElementPasswordRepeat,
    passwordRepeatValue = formsElementPasswordRepeat.value.trim(),
]

setupForms.addEventListener("submit", (e) => {

    if (email === "" || !email.search(/@/gi)) {
        
    }

    e.preventDefault();

});

