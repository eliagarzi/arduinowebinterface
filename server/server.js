const express = require("express");
const http = require("http");
const cors = require("cors");
const redis = require("redis");
const crypto = require("crypto");
const events = require('events');
const { ServerResponse } = require("http");

const socket = require("socket.io")(3000, {
    cors: {
        origin: ["http://127.0.0.1:5500"],
    } 
})

socket.on("connection", socket => {

});

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

server.post("/api/arduino/change", checkQuery, checkBody, (req, res) => {

    if(req.query.uuid != undefined) {
        const currentUUID = req.query.uuid;

        if(req.body.name != undefined && req.body.location != undefined) {

        } else {
            res.json("")
        }
    } else {
        res.json("")
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


server.post("/api/data/", checkQuery, async (req, res) => {
    //checkAuth
    const currentUUID = req.query.uuid;
    const ardunioData = req.body;
    if(currentUUID != undefined) {
        try {
            //console.log(await redisClient.lRange("uuid-store", 0, -1))
            if (await redisClient.exists(`${currentUUID}-info`)) {
                //Speichert Daten mit dem Key Current UUID in einer Liste


                /*
                let newBodyForRedis = {
                    time: "18:00",
                    data: req.body
                }

                */

                //await redisClient.lPush(`${currentUUID}-data`, JSON.stringify(newBodyForRedis));
                
                 //##############################Speichert aktuell nur 1 Element der Ardunio Daten
                await redisClient.del(`${currentUUID}-data`)
                await redisClient.set(`${currentUUID}-data`, JSON.stringify(req.body))

                //Neuer Body, damit durch die UUID das Ardunio bestimmt werden kann, welches neue Daten hat
                let newBody =  {
                    uuid: req.query.uuid,
                    data: {
                        "temperature": req.body.temperature,
                        "humidty": req.body.humidty,
                        "pressure": req.body.pressure,
                        "hue": req.body.hue
                    }
                }
                
                //Löst einen Push Event aus, damit die Daten im Frontend geupdatet werden
                //Sendet die Daten mit UUID und neuen Daten an das Frontend
                io.sockets.emit("data-update-event", newBody);
                
                //console.log(JSON.parse(await redisClient.get(`${currentUUID}-data`)))

                res.sendStatus(201)
            } else {
                res.sendStatus(404)
            }
        } catch (error) {
            console.log(error)
            res.sendStatus(504)
        }
    } else {
        res.sendStatus(404)
    }
})

//Query &index=
server.get("/api/data/", checkQuery, checkAuth, async(req, res) => {
    const currentUUID = req.query.uuid;
    if(currentUUID != undefined) {
        try {
            if (await redisClient.exists(`${currentUUID}-data`)) {

                //last index of list 
                //const arudnioDataToGet = await redisClient.lRange(`${currentUUID}-data`,0, -1)

                //##############################Speichert aktuell nur 1 Element der Ardunio Daten
                const arudnioDataToGet = JSON.parse(await redisClient.get(`${currentUUID}-data`))

                res.json(arudnioDataToGet)
            } else {
                res.sendStatus(404)
            }
        } catch (error) {
            console.log(error)
            res.sendStatus(504)
        }
    } else {
        res.sendStatus(404)
    }
})

server.get("/login/", async (req, res) => {

})

server.post("/login/reset", async (req, res) => {
    let currentEmail = req.query.email;
    if(currentEmail != undefined) {
        let token = crypto.randomBytes(35);
        try {
            await redisClient.set(token, req.query.email, 'EX', 60 * 10)

            //Send Mail
        } catch {
            res.sendStatus(504)
        }
    } else {
        res.sendStatus(404)
    }
})

//Generelle Funktionen
http.listen(port, (error) => {
    if(error) {
        console.error(`Fehler beim Starten des Servers ------ ${error}`)
    } else {
        console.log(`Server auf Port ${port} gestartet`)
    }
})