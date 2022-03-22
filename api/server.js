const express = require("express");
const port = 4000;

const server = new express();

server.get("api/", (req, res) => {

});



server.listen(port, (err) => {
    if (err) {
        console.log(`Beim starten der API auf Port ${port} ist ein Fehler aufgetreten!`)
        console.log(err);
    } else {
        console.log(`Die API ist auf ${port} gestartet!`)
    }
})

