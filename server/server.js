const express = require("express");
//Express APP wird an HTTP Server übergeben
const server = new express();
const port = 3300
const http = require("http").Server(server);

const cors = require("cors");
const redis = require("redis");
const crypto = require("crypto");
const events = require('events');
const { ServerResponse } = require("http");

//const { createAdapter } = require("@socket.io/redis-adapter");

let eventEmitter = new events.EventEmitter(); 

let messageValidationFailed = "Validation failed";
let messageRedisServerFailed = "Redis Server failed";

//############################################
//Speichern der UUID Liste im Node-Cache beim Startup, damit das überprüfen der Querystrings schneller funktioniert

const io = require("socket.io")(3000, {
    cors: {
        origin: ["http://127.0.0.1:5501"], //Darf nur von FQDN:Port möglich sein
    } 
})

//############################
//Authentifizierung fehlt
//############################
const redisClient = redis.createClient({
    host: '127.0.0.1',
    port: 6379
})

redisClient.connect();

redisClient.on("error", (error) => {
    console.log(error)
})

async function getArdunioData() {
    //console.log(await redisClient.lRange("uuid-store", 0, -1))
    try {
        let exists = await redisClient.exists("uuid-store");

        if(exists == 1) {
                let bodyToSend = {}
                let allUUIDs = await redisClient.lRange("uuid-store", 0, -1)

                for(let elementIndex in allUUIDs) {
                    let currentUUID = allUUIDs[elementIndex];
                    let currentArdunioInfo = JSON.parse(await redisClient.get(`${currentUUID}-info`));
                    let currentArdunioData = JSON.parse(await redisClient.get(`${currentUUID}-data`));
    
                    let currentObj = {
                        uuid: currentUUID,
                        info: currentArdunioInfo,
                        data: currentArdunioData
                    }
    
                    bodyToSend[elementIndex] = currentObj;
                }
                
                return bodyToSend;
        } else {
            return {init: true}
        }
    } catch (error) {
        return error;
    }
}

io.on("connection", socket => {
    //authentication
    //push ardunio data
    getArdunioData()
    .then((data) => {
        socket.emit("ardunio-init-data", data)
    })
    .catch((error) => {
        socket.emit("error-event");
    })
})

io.on("get-init-data", () => {

})

io.on("server-new-data", () => {
    console.log("event emitted")
})


server.post("/test", async (req, res) => {
    console.log("event")
    
    /*
    let uuidlist = [123213, 12312314145245, 139932983298398, 1092197142, 1932412874981];
    await redisClient.set("uuid-store", JSON.stringify(uuidlist))
    let list = await redisClient.get("uuid-store");
    console.log(list)

    */

    res.sendStatus(200)
})



/*
async function writeListToRedis(key, value) {
        try {
            //redisClient.on("error", () => {
            //    throw new Error();
            //})
    
            await redisClient.set(key, value);
            console.log(await redisClient.get(key));
        } catch (error) {
            return error;
        }
}
*/

//Body-Parser, damit der Inhalt vom Body als JSON lesbar wird
server.use(express.json());

//Middlewarefunktion zum überprüfen, ob der Client authentifiziert ist
function checkAuth(req, res, next) {
    if (true) {
        //Überprüfen des JWT Token
        next()
    } else {
        res.sendStatus(503)
    }
}

//Middlewarefunktion zum überprüfen, ob der Body nicht leer ist
function checkBody(req, res, next) {
    if (req.body != undefined) {
        next()
    } else {
        res.sendStatus(404)
    }
}

//Überprüft, ob die benötigten Angaben im Querystring mitgegeben werden, die für die weiteren Middlewarefunktionen benötigt werden
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
    - Socket.io zum Frontend
*/

//##############################
//Routes für arduino
//##############################

//Route um einen Ardunio zu löschen
//Format: "http://fqdn/api/arduino/delete/?id=uuid"
server.post("/api/arduino/delete", checkQuery, async (req, res) => {
    const currentUUID = req.query.uuid;
    if(currentUUID != undefined) {
        if(await redisClient.exists(`${currentUUID}-info`)) {
            try {
                await redisClient.lRem("uuid-store", 1, currentUUID)

                //Löschen der Ardunio Infos und Daten UUID 
                await redisClient.del(`${currentUUID}-info`)
                await redisClient.del(`${currentUUID}-data`)
                
                //###############################
                //Delete JWT Token
                //###############################

                //console.log(await redisClient.lRange("uuid-store", 0, -1))

                io.sockets.emit("ardunio-delete-event", {uuid: currentUUID});

                res.sendStatus(200)
            } catch (error) {
                //Log
                console.log(error)
                res.json({message: "Redis Server failed"})
            }       
        } else {
            res.sendStatus(404)
        }
    } else {
        res.sendStatus(404);
    }
});

//Route um einen neuen arduino zu erfassen
//Format: "http://fqdn/api/arduino/create"
/*
{
    {
        name: "arduino123",
        location: "Zürich",
        lastseen: "00:00" //Eventuell als Time Objekt speichern
        data: [
            {
                time: 12:33
                temp: 12,
                hum: 38%
            },
            {
                time: 12:23;
                temp: 12,
                hum: 38%
            },
            {
                time: 12:23;
                temp: 12,
                hum: 38%
            },
            //Append new data
        ]
    }
}
*/

server.post("/api/arduino/create/", async (req, res) => {

    //Überprüfe, ob die benötigten Body Elemente vorhanden sind 
    if (req.body.name != undefined && req.body.location != undefined && req.body.lastseen != undefined) {
        const newUUID = crypto.randomUUID();
        try {

            //In Redis speichern

            await redisClient.set(`${newUUID}-info`, JSON.stringify(req.body));

            await redisClient.set(`${newUUID}-data`, JSON.stringify({
                "temperature":"-",
                "humidty":"-",
                "pressure":"-",
                "Hue":"-"
            }));

            

            await redisClient.lPush("uuid-store", newUUID)

            let newBody =  {
                uuid: newUUID,
                info: {
                    "name": req.body.name,
                    "location": req.body.location,
                    "lastseen": req.body.lastseen,  
                },
                data: {
                    "temperature":"-",
                    "humidty":"-",
                    "pressure":"-",
                    "Hue":"-"
                }
            }

            console.log(newBody)

                
            //Löst einen Push Event aus, damit die Daten im Frontend geupdatet werden
            //Sendet die Daten mit UUID und neuen Daten an das Frontend
            io.sockets.emit("ardunio-create-event", newBody);

            res.json({uuid: newUUID, body: newBody})
        } catch (error) {
            //Login Menu
            console.log(error)
            res.json({error: messageRedisServerFailed})
        }
    } else {
        //Nachricht soll im Frontend dargestellt werden
        res.json({error: messageValidationFailed});
    }

});

server.post("/api/arduino/change", checkQuery, checkBody, async (req, res) => {
    if(req.query.uuid != undefined) {
        const currentUUID = req.query.uuid;
        if(req.body.name != undefined && req.body.location != undefined) {
            try {
                if(await redisClient.exists(`${currentUUID}-info`)) {
                    let newName = req.body.name;
                    let newLocation = req.body.location;
                    
                    let ardunioToChange = JSON.parse(await redisClient.get(`${currentUUID}-info`));
    
                    ardunioToChange.location = newLocation;
                    ardunioToChange.name = newLocation;
    
                    //In Redis speichern
                    await redisClient.set(`${currentUUID}-info`, JSON.stringify(ardunioToChange))
    
                    //Neuer Body, damit durch die UUID das Ardunio bestimmt werden kann, welches neue Daten hat
                    let newBody =  {
                        uuid: req.query.uuid,
                        data: req.body
                    }
                    
                    //Löst einen Push Event aus, damit die Daten im Frontend geupdatet werden
                    //Sendet die Daten mit UUID und neuen Daten an das Frontend
                    io.sockets.emit("ardunio-update-event", newBody);
    
                    res.json({message: "Ardunio Properties Changed"})
                } else {
                    res.sendStatus(404)
                }
            } catch (error) {
                console.log(error)
                res.json({error: messageRedisServerFailed})
            }
        } else {
            res.json({error: messageValidationFailed})
        }
    } else {
        res.json({error: messageValidationFailed})
    }

});

//Route um die Daten zu bestimmten Arduino abzurufen 
//Format: "http://fqdn/api/arduino/?id=uuid"
server.get("/api/arduino/", async (req, res) => {
    const currentUUID = req.query.uuid;
    if(currentUUID!= undefined) {  
        //aus Redis abrufen
        try {
            //Überorüfen, ob die UUID in Redis gespeichert ist
            if(await redisClient.exists(currentUUID)) {
                const arduinoToGet = JSON.parse(await redisClient.get(`${currentUUID}-info`))
                res.json(arduinoToGet)
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

//Format: "http://fqdn/api/arduino/all"
//Route um die Daten zu allen Arduinos abzurufen -> Funktioniert nur mit Auth
server.get("/api/arduino/all/", checkAuth, (req, res) => {
    //aus Redis abrufen
})

//Format "http://fqdn/api/data/uuid?=uuid"
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

server.get("/api/data/", async(req, res) => {
    const currentUUID = req.query.uuid;
    if(currentUUID != undefined) {
        try {
            if (await redisClient.exists(`${currentUUID}-data`)) {

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