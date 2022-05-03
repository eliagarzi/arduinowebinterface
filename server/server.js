const express = require("express");
//Express APP wird an HTTP Server übergeben
const server = new express();
const port = 3300
const http = require("http").Server(server);

const cors = require("cors");
const redis = require("redis");
const crypto = require("crypto");
const events = require('events');
const { Socket } = require("socket.io");

let eventEmitter = new events.EventEmitter(); 

let messageValidationFailed = "Validation failed";
let messageRedisServerFailed = "Redis Server failed";

//############################################
//Speichern der UUID Liste im Node-Cache beim Startup, damit das überprüfen der Querystrings schneller funktioniert



const io = require("socket.io")(3000, {
    cors: {
        origin: ["http://localhost:5501"], //Darf nur von FQDN:Port möglich sein
    } 
})

io.on("connection", socket => {
    //authentication
    //push ardunio data

    console.log(socket.id)

    socket.send(() => {
        async () => {
            //let ardunioInfo = 
            //let ardunioData = 
            for(let elementIndex in allUUIDs) {
                let currentUUID = allUUIDs[elementIndex];
                let currentArdunioInfo = JSON.parse(await redisClient.get(currentUUID));
                let currentArdunioData = JSON.parse(await redisClient.lRange(currentUUID, -1));
            }
        }
        return 1;
    })      
})

io.on("server-new-data", () => {
    console.log("event emitted")
})

eventEmitter.on("data-update", () => {
    //Wenn data-update event stattgefunden hat
})

server.post("/test", (req, res) => {
    console.log("event")
    
    res.sendStatus(200)
})


//############################
//Authentifizierung fehlt
//############################
const redisClient = redis.createClient({
    host: '127.0.0.1',
    port: 6379
})

redisClient.connect()

redisClient.on("error", (error) => {
    //Log
    console.log(error)
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
    let currentUUID = req.query.uuid;
    if(currentUUID != undefined) {
        if(await redisClient.exists(currentUUID)) {
            try {
                //#############################
                //Möglichkeit suchen, um einen ganz bestimmten Wert in der Liste zu löschen

                //UUID aus dem UUID-Speicher löschen
                //let currentRedisListIndex = await redisClient.lIndex()
                //await redisClient.delete()
                //Löscht das arduino Objekt in welchem alle Angaben gespeichert sind
                await redisClient.del(currentUUID)
                //###############################
                //Delete JWT Token
                //###############################
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

    //#############Es muss noch überprüft werden, dass nicht zuviele Elemente im Body sind
    //Überprüfe, ob die benötigten Body Elemente vorhanden sind 
    if (req.body.name != undefined && req.body.location != undefined && req.body.lastseen != undefined) {
        let newUUID = crypto.randomUUID();
        //################Redis ist noch nicht connected
        //arduinos als Liste speichern
        try {
            //await redisClient.lPush("uuid-store", newUUID)
            await redisClient.set(newUUID, JSON.stringify(req.body));
            const arduino = JSON.parse(await redisClient.get(newUUID))
            console.log(await redisClient.lRange("uuid-store", 0, -1))

            let newBody =  {
                uuid: newUUID,
                info: {
                    "name": req.body.name,
                    "location": req.body.location,
                    "lastseen": req.body.lastseen,
                },
                data: {
                    "placeholder":"",
                    "placeholder":"",
                    "placeholder":"",
                    "placeholder":""
                }
            }
                
            //Löst einen Push Event aus, damit die Daten im Frontend geupdatet werden
            //Sendet die Daten mit UUID und neuen Daten an das Frontend
            io.sockets.emit("new-data", newBody);

            res.sendStatus(201)
        } catch (error) {
            //Login Menu
            console.log(error)
            res.json({error: messageRedisServerFailed})
        }
    } else {
        //Nachricht soll im Frontend dargestellt werden
        res.json({error: messageValidationFailed});
    }
    //In Redis speichern
    //Websocket Event auslösen
});

server.post("/api/arduino/change", checkQuery, checkBody, async (req, res) => {
    if(req.query.uuid != undefined) {
        const currentUUID = req.query.uuid;
        if(req.body.name != undefined && req.body.location != undefined) {
            try {
                let newName = req.body.name;
                let newLocation = req.body.location;

                let ardunioToChange = JSON.parse(await redisClient.get(currentUUID));

                ardunioToChange.location = newLocation;
                ardunioToChange.name = newLocation;

                await redisClient.set(ardunioToChange)

                                //Neuer Body, damit durch die UUID das Ardunio bestimmt werden kann, welches neue Daten hat
                let newBody =  {
                    uuid: req.query.uuid,
                    data: req.body
                }
                
                //Löst einen Push Event aus, damit die Daten im Frontend geupdatet werden
                //Sendet die Daten mit UUID und neuen Daten an das Frontend
                io.sockets.emit("ardunio-update-event", newBody);

                res.json({message: "Ardunio Properties Changed"})
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
    //In Redis speichern
    //Websocket Event auslösen
});

//Route um die Daten zu bestimmten Arduino abzurufen  -> Funktioniert nur mit Auth
//Format: "http://fqdn/api/arduino/?id=uuid"
server.get("/api/arduino/", async (req, res) => {
    const currentUUID = req.query.uuid;
    if(currentUUID!= undefined) {  
        //aus Redis abrufen
        try {
            //Check if redis contains uuid
            if(await redisClient.exists(currentUUID)) {
                const arduinoToGet = JSON.parse(await redisClient.get(currentUUID))
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
/*

{
    temp: 23,

}

*/

server.post("/api/data/", checkQuery, checkAuth, async (req, res) => {
    const currentUUID = req.query.uuid;
    const ardunioData = req.body;
    if(currentUUID != undefined) {
        try {
            if (await redisClient.exists(currentUUID)) {
                //Speichert Daten mit dem Key Current UUID in einer Liste
                await redisClient.lPush(currentUUID, JSON.stringify(ardunioData));
                
                //Neuer Body, damit durch die UUID das Ardunio bestimmt werden kann, welches neue Daten hat
                let newBody =  {
                    uuid: req.query.uuid,
                    data: req.body
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

//Query &index=
server.get("/api/data/", checkQuery, checkAuth, async(req, res) => {
    const currentUUID = req.query.uuid;
    if(currentUUID != undefined) {
        try {
            if (await redisClient.exists(currentUUID)) {

                //last index of list 
                const arudnioDataToGet = JSON.parse(await redisClient.lRange(currentUUID, -1))

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

//Generelle Funktionen
http.listen(port, (error) => {
    if(error) {
        console.error(`Fehler beim Starten des Servers ------ ${error}`)
    } else {
        console.log(`Server auf Port ${port} gestartet`)
    }
})