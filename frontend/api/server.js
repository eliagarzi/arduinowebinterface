const redis = require("redis");
const express = require("express");
const server = new express();
const HTTPserver = require('http').createServer(server);

const port = 8080;

server.use(express.json());

const redisClient = redis.createClient({
    url: 'redis://127.0.0.1:6379'
})

async function storeListInRedis(key, value) {
    try {
        //redisClient.on("error", () => {
        //    throw new Error();
        //})
        await redisClient.connect();
        await redisClient.set(key, value);
        console.log(await redisClient.get(key));
    } catch (error) {
        return error;
    }
}





server.post("/api/ardunio/status", (req, res) => {
    let ardunioKey = req.body.key;
    let ardunioValue = req.body.value;

    storeListInRedis(ardunioKey, ardunioValue)
    .then(() => {
        //Update Frontend event
        res.sendStatus(200); 
    })
    .catch((error) => {
        console.error(error)
        res.sendStatus(504)
    })
   
});

server.get("/api/ardunio/config/download", (req, res) => {
    res.download("./dbtest.js");
}); 

HTTPserver.listen(port, (error) => {
    if(error) {
        console.log(`Fehler beim Starten vom Server auf Port ${port} ----- ${error}`)
    } else {
        console.log(`Server gestartet auf Port ${port}`)
    }
})
