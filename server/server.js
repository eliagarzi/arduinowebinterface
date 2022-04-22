const express = require("express");
//Express APP wird an HTTP Server übergeben
const server = new express();
const port = 3300
const http = require("http").Server(server);

const cors = require("cors");
const redis = require("redis");
const crypto = require("crypto");

//############################################
//Speichern der UUID Liste im Node-Cache beim Startup, damit das überprüfen der Querystrings schneller funktioniert

const socket = require("socket.io")(3000, {
    cors: {
        origin: ["http://127.0.0.1:5500"], //Darf nur von FQDN:Port möglich sein
    } 
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
    - Redis Connection
*/

//##############################
//Routes für Ardunio
//##############################

//Route um einen neuen Ardunio zu erfassen
//Format: "http://fqdn/api/ardunio/delete/?id=uuid"
server.post("/api/arduino/delete", checkQuery, async (req, res) => {
    
    let currentUUID = req.query.uuid;
    if(currentUUID != undefined) {
        if(await redisClient.exists(currentUUID)) {
            try {
                //UUID aus dem UUID-Speicher löschen
                //await redisClient.delete()
                //Löscht das Ardunio Objekt in welchem alle Angaben gespeichert sind
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

//Route um einen neuen Ardunio zu erfassen
//Format: "http://fqdn/api/ardunio/create"
/*
{
    {
        name: "ardunio123",
        location: "Zürich",
        lastseen: "00:00" //Eventuell als Time Objekt speichern
    }
}
*/

server.post("/api/arduino/create/", async (req, res) => {

    //#############Es muss noch überprüft werden, dass nicht zuviele Elemente im Body sind

    //Überprüfe, ob die benötigten Body Elemente vorhanden sind 
    if (req.body.name != undefined && req.body.location != undefined && req.body.lastseen != undefined) {
        let newUUID = crypto.randomUUID();
        //################Redis ist noch nicht connected
        //Ardunios als Liste speichern
        try {
            await redisClient.lPush("uuid-store", newUUID)
            await redisClient.set(newUUID, JSON.stringify(req.body));
            const ardunio = JSON.parse(await redisClient.get(newUUID))
            console.log(await redisClient.lRange("uuid-store", 0, -1))




            res.sendStatus(201)
        } catch (error) {
            //Login Menu
            console.log(error)
            res.json({error: "Redis Server failed"})
        }
    } else {
        //Nachricht soll im Frontend dargestellt werden
        res.json({error: "Validation failed"});
    }
    //In Redis speichern
    //Websocket Event auslösen
});

//Route um die Daten zu bestimmten Arduino abzurufen  -> Funktioniert nur mit Auth
//Format: "http://fqdn/api/arduino/?id=uuid"
server.get("/api/arduino/", async (req, res) => {
    let currentUUID = req.query.uuid;
    if(currentUUID!= undefined) {  
        //aus Redis abrufen
        try {
            //Check if redis contains uuid
            if(await redisClient.exists(currentUUID)) {
                const ardunioToGet = JSON.parse(await redisClient.get(currentUUID))
                res.json(ardunioToGet)
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

//Format: "http://fqdn/api/ardunio/all"
//Route um die Daten zu allen Arduinos abzurufen -> Funktioniert nur mit Auth
server.get("/api/ardunio/all/", checkAuth, (req, res) => {
    //aus Redis abrufen
})

//Generelle Funktionen
http.listen(port, (error) => {
    if(error) {
        console.error(`Fehler beim Starten des Servers ------ ${error}`)
    } else {
        console.log(`Server auf Port ${port} gestartet`)
    }
})