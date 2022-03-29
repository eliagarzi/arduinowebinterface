/*  Tabelle Ardunio
    JSON Objekt
    - ID
    - Name

    Tabelle Werte
    JSON Objekt 
    - Ardunio
    - Temp
    - Humidity
*/

const sqlite3 = require("sqlite3");
const redisClient = require("redis")

async function connectRedis() {
    const client = redisClient({
        url: 'redis://127.0.0.1:6380'
    });

    client.on()

    await client.connect(); 

    await client.set()
}




function openDB() {
    const db = new sqlite3.Database("ardunino.db", sqlite3.OPEN_CREATE ,(error) => {
        if(error) console.error(`Fehler bei der Verbindung mit der Datenbank ${error}`)
        else {
            console.log(`Verbindung mit Datenbank in Ordnung`)
        }
    })
    return db;
}

function buildDatabase(){

}

function closeDatabase() {
    db.close((error) => {
        if(error) console.error(`Fehler beim Schliessen der Datenbank ${error}`)
        else {console.log(`Datenbank erfolgreich geschlossen`)}
    })
}

function getTempInfo(db, sql) {
    try {
        await db.all(sql)  
    } catch (error) {

    }
}

//https://www.linode.com/docs/guides/getting-started-with-nodejs-sqlite/
//https://github.com/mapbox/node-sqlite3/wiki/API