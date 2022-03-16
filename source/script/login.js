const loginMenu = document.querySelector(".login-menu")

const loginForm = document.querySelector(".login-form")
const passwordResetForm = document.querySelector(".password-reset-form");

const resetPasswordButton = document.querySelector(".form-element__reset-password");
const backToLoginButton = document.querySelector(".form-element__backtologin-button");

resetPasswordButton.addEventListener("click", function() {
    console.log("test")
    loginForm.style.display = "none";
    passwordResetForm.style.display = "block";
    loginMenu.style.height="30rem";
    
    

    /*
        loginForm.classList.remove(".login-form-displayblock");
    loginForm.classList.add(".login-form-displaynone");
    passwordResetForm.classList.add(".login-form-displayblock");
    
    */
});

backToLoginButton.addEventListener("click", function() {
    passwordResetForm.style.display = "none";
    loginForm.style.display = "block";
    loginMenu.style.height="39.2rem";
    
    /*
    
    passwordResetForm.classList.remove(".form-displayblock");
    passwordResetForm.classList.add(".form-displaynone");
    loginForm.classList.add(".form-displayblock");

     */
});
