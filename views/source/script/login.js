const loginForm = document.querySelector(".login-form")
const passwordResetForm = document.querySelector(".password-reset-form");

const resetPasswordButton = document.querySelector(".form-element__reset-password");
const backToLoginButton = document.querySelector(".form-element__backtologin-button");

resetPasswordButton.addEventListener("click", function() {
    console.log("test")
    passwordResetForm.style.display = "none";
    loginForm.style.display = "block";
    

    /*
        loginForm.classList.remove(".login-form-displayblock");
    loginForm.classList.add(".login-form-displaynone");
    passwordResetForm.classList.add(".login-form-displayblock");
    
    */
});

backToLoginButton.addEventListener("click", function() {
    loginForm.style.display = "none";
    passwordResetForm.style.display = "block";

    /*
    
    passwordResetForm.classList.remove(".form-displayblock");
    passwordResetForm.classList.add(".form-displaynone");
    loginForm.classList.add(".form-displayblock");

     */
});
