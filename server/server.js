const express = require("express");
const http = require("http");
const cors = require("cors");
const redis = require("redis");
const crypto = require("crypto");

const socket = require("socket.io")(3000, {
    cors: {
        origin: ["http://127.0.0.1:5500"],
    } 
})

const server = new express();
const port = 8080

const httpServer = new http.server(server);

server.use(express.json());

//Middlewarefunktionen

function checkAuth(req, res, next) {
    if (auth) {
        //Überprüfen des JWT Token
    } else {
        res.sendStatus(503)
    }
}

function checkBody(req, res, next) {
    if (req.body != undefined) {
        next()
    } else {
        res.sendStatus(404)
    }
}

//Überprüft, ob die benötigten Angaben im Querystring mitgegeben werden
function checkQuery(req, res, next) {
    if (req.query != undefined) {
        next()
    } else {
        res.sendStatus(404)
    }
}

/*
    Todo:
    - JWT Auth
    - Middlewarfuktionen in Routen erfassen
*/

//##############################
//Routes für Ardunio
//##############################

//Route um einen neuen Ardunio zu erfassen
server.post("/api/arduino/delete", checkQuery, (req, res) => {

    if(req.query.id != undefined) {
        //id= UUID
    } else {
        res.sendStatus(404);
    }
});

//Route um einen neuen Ardunio zu erfassen
server.post("/api/arduino/create", checkBody, (req, res) => {

    const json = {
        displayName: "Ardunio 1",
        creation: "Date",
        location: "Zurich West"    
    }

    const ardunio = {
        UUID: generateNewArdunioUUID(),
        
    }


    //In Redis speichern
    //Websocket Event auslösen

});

//Route um die Daten zu bestimmten Arduino abzurufen  -> Funktioniert nur mit Auth
server.get("/api/ardunio/", checkQuery, (req, res) => {

    if(req.query.id != undefined) {
        //aus Redis abrufen
    } else {
        res.sendStatus(404)
    }
    
})

//Route um die Daten zu allen Arduinos abzurufen -> Funktioniert nur mit Auth
server.get("/api/ardunio/all", (req, res) => {
    //aus Redis abrufen
})

//Generelle Funktionen

function generateNewArdunioUUID() {
    
    

}


httpServer.listen(port, (error) => {
    if(error) {
        console.error(`Fehler beim Starten des Servers ------ ${error}`)
    } else {
        console.log(`Server auf Port ${port} gestartet`)
    }
})