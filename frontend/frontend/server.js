const express = require("express");
const port = 3000; 

//Eine neue Instanz des Express Objekt erstellen
const server = express();

//Die View Engine bestimmen, die Node.js nutzen soll
server.set("view engine", "ejs");

//Bestimmen wo Node für das rendern von EJS-Files statische files ziehen kann
server.use(express.static(__dirname + '/source'));


server.use(express.json());
const loginRoutes = require('./routes/login');



server.use("/login", loginRoutes)

server.get("/index", (httprequest, httpresponse) => {
    httpresponse.render("index");
});





//Definieren auf welchem Port der Server Daten empfangen kann
//Damit wir wissen, wann der Server gestartet ist, triggern wir eine Callback Funktion, welche uns bescheid gibt, dass der Server gestartet ist
server.listen(port, (error) => {
    if(error) {
        console.error(error)
    } else {
        console.log(`Node.js Server is running on Port ${port}`);
    }
});