const loginMenu = document.querySelector(".login-menu")

const loginForm = document.querySelector(".login-form")
const passwordResetForm = document.querySelector(".password-reset-form");

const resetPasswordButton = document.querySelector(".form-element__reset-password");
const backToLoginButton = document.querySelector(".form-element__backtologin-button");

resetPasswordButton.addEventListener("click", function() {
    loginForm.style.display = "none";
    passwordResetForm.style.display = "block";

    if (screen.availWidth > 600) {
        loginMenu.style.height="30rem";
    }
});

backToLoginButton.addEventListener("click", function() {
    passwordResetForm.style.display = "none";
    loginForm.style.display = "block";
    
    if (screen.availWidth > 600) {
        loginMenu.style.height="39.2rem";
    }
});

const loginFormEmail = document.querySelector(".login-form-email");
const loginFormPassword = document.querySelector(".login-form-password");

const passwordResetFormEmail = document.querySelector(".password-reset-form-email");

loginForm.addEventListener("submit", (e) => {

    if (loginFormEmail.value.trim() !== "" || loginFormEmail.value.search(/@/gi)) {
        loginFormEmail.style.border = "2px solid green";
    } else {
        loginFormEmail.style.border = "2px solid red";
        e.preventDefault();
    }

    if (loginFormPassword.value.trim() !== "") {
        loginFormPassword.style.border = "2px solid green";
    } else {
        loginFormPassword.style.border = "2px solid red";
        e.preventDefault();
    }
});

passwordResetForm.addEventListener("submit", (e) => {

    if (passwordResetFormEmail.value.trim() !== "" || passwordResetFormEmail.value.search(/@/gi)) {
        
        passwordResetFormEmail.style.border = "2px solid green";
    } else {
        passwordResetFormEmail.style.border = "2px solid red";
        e.preventDefault();
    }

});
