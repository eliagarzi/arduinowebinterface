async function sendPassword(url, passworddata) {
    try {
        const request = await fetch(url, {
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(passworddata)
        })
    } catch (error) {
        console.error(error)
    }
}

const resetForm = document.querySelector(".password-reset");
const resetFormInput = document.querySelector(".password-reset-input");

resetForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let urlArray = window.location.href.split("=");
    let randomString = urlArray[1];

    console.log(window.location.href)

    if (resetFormInput !== "") {
        sendPassword(window.location.href, {password: resetFormInput.value});
    }
})