const loginInfo = document.querySelector(".login-info");
const formElementInfo = document.querySelector(".form-element__info");
const formElementInfoP = document.querySelector(".form-element__info").childNodes[1];

//Sendet die Informationen fürs Login an das Backend
async function sendJSONToBackend(url, JSONData, infoDOMobject) {
    try {
        const reponse = await fetch(url, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(JSONData)
        })
        return reponse;
    } catch (error) {
        console.error(error)
        infoDOMobject.style.display = "block";
        formElementInfoP.textContent = `Fehler bei der Übertragung ${error}`;
    }
}

//Info-Menü, welches sich öffnet sobald es bei einer Fetch Übetragung einen Fehler gibt
//inkl. Button, um dieses Menü wieder zu schlissen 
const closeLoginInfoButton = document.querySelector(".login-info__close-window");
closeLoginInfoButton.addEventListener("click", () => {
    loginInfo.style.display = "none";
});

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

loginForm.addEventListener("submit", async (event) => {
    //Event 
    event.preventDefault();

    if (loginFormEmail.value.trim() !== "" && !loginFormEmail.value.search(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        formElementInfo.style.display = "none";
        loginFormEmail.style.border = "2px solid #3eb666";

        if (loginFormPassword.value.trim() !== "") {
            loginFormPassword.style.border = "2px solid #3eb666";
            formElementInfo.style.display = "none";
            sendJSONToBackend("http://127.0.0.1:3000/api/user/login", {email: loginFormEmail.value, password: loginFormPassword.value}, loginInfo)
            .then((response) => response.json())
            .then((data) => {
                formElementInfo.style.display = "block";
                formElementInfoP.textContent = data.message;
            });

        } else {
            loginFormPassword.style.border = "2px solid #f0783d";
            formElementInfo.style.display = "block";
            formElementInfoP.textContent = "Password is empty"
        }
    } else {
        loginFormEmail.style.border = "2px solid #f0783d";
        formElementInfo.style.display = "block";
        formElementInfoP.textContent = "Not an E-Mail"
    }
});

const showPasswordButton = document.querySelector(".show-password-button");
const showPasswordButtonImage = document.querySelector(".show-password-button__image");
const showPasswordButtonText = document.querySelector(".show-password-button__text");

let showPasswordToggle = 0;

showPasswordButton.addEventListener("click", function(){
    if (showPasswordToggle == 0) {
        loginFormPassword.type = "text";
        showPasswordButtonImage.src = "/img/login/eye-open.png";
        showPasswordButtonText.textContent = "hide"
        showPasswordToggle = 1;
    } else {
        loginFormPassword.type = "password";
        showPasswordButtonImage.src = "/img/login/eye-closed.png";
        showPasswordButtonText.textContent = "show"
        showPasswordToggle = 0;
    }
}); 

const resetPasswordForm = document.querySelector(".password-reset-form");
const resetPasswordFormEmail = document.querySelector(".password-reset-form-email");
const formElementEmail = document.querySelector(".reset-form-element__email");
const formElementButton = document.querySelector(".reset-form-element-submit");
const formElementFinish = document.querySelector(".password-reset-form-finish");

resetPasswordForm.addEventListener("submit", (event) => {
    const formElementInfo = document.querySelector(".form-element__info");
    event.preventDefault();
    if (resetPasswordFormEmail.value !== "" && !resetPasswordFormEmail.value.search(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        formElementInfoP.style.display = "none";
        resetPasswordFormEmail.style.border = "2px solid #3eb666";

        sendJSONToBackend("http://127.0.0.1:3000/user/reset", {email: resetPasswordFormEmail.value}, loginInfo)
        .then((response) => response.json())
        .then((data) => {
            formElementEmail.style.display = "none";
            formElementButton.style.display = "none";
            formElementFinish.style.display = "block";
            formElementFinish.childNodes[1].textContent = data.message;
        });
    
    } else {
        formElementInfo.style.display = "block";
        formElementInfoP.textContent = "Not an E-Mail"
    }
});

async function sendEmail(url, email) {
    try {
        const request = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(email)
        })
        if(!request.ok) {
            throw new error();       
        } else {
            return request;
        }
    } catch (error) {
        console.log(error)
    }
}