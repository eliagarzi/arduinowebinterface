const express = require("express");
const path = require("path");
const bodyParser = require("body-parser"); //Middleware, um das Body objekt im HTTP Request zu abstrahieren
const { red } = require("color-name");

const port = 3000; 

//Eine neue Instanz des Express Objekt erstellen
const server = express();

//Die View Engine bestimmen, die Node.js nutzen soll
server.set("view engine", "ejs");

//Body Parser Middleware um auf Elemente im Body des HTTP Requests zuzugreifen
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//Bestimmen wo Node für das rendern von EJS-Files statische files ziehen kann
server.use(express.static(__dirname + '/source'));

/*
    HTTPRequest und HTTPResponse sind Objekte, die jegliche Eigenschaften zu den HTTP Responses und Requests speichern.

    So besitzt das Objbekt HTTPRequest z.B. die Eigenschaften

    httprequest.url = URL die Angefordert wird
    httprequest.method = HTTP Methode (Z.B. GET, POST, DELETE etc.)
    httprequest.headers = Jegliche Eigenschaften, die im Header des HTTP-Requests mitgesendet wurden
*/

//Dies ist der Event-Handler falls sich jemand versucht einzulogen
server.post("/login", urlencodedParser, (httprequest, httpresponse) => {
    const input = {username: httprequest.body.loginemail, password: httprequest.body.loginpassword}

    if (input.username === "admin@local.com" && input.password === "password") {
        httpresponse.render("index");
    } else {
        httpresponse.render("login", {message: 'Username oder Passwort ist falsch'});
    }
}); 

server.post("/reset", urlencodedParser, (httprequest, httpresponse) => {
    const input = {username: httprequest.body.passwordresetemail}

    //Send Email

    if (input.username === "admin@local.com" && input.password === "password") {
        httpresponse.render("index");
    } else {
        httpresponse.render("login", {message: 'Username oder Passwort ist falsch'});
    }
});

server.post("/api", (httprequest, httpresponse) => {
    if (req.query.newarduino != undefined && req.query.newarduino != null) {
        console.log(httpresponse.query.newarduino)
    }
});

//Falls jemand nur die 
server.get("/", (req, res) => {

    //Check Session Auth

    res.render("index");
});

server.get("/login", (req, res) => {
    res.render("login", {message: ''})
});

server.get("/dashboard/download", (httprequest, httpresponse) => {
    httpresponse.download("./test.txt");
}); 

server.get("/api", (req, res) => {
    const json = [
        {data: "Spöng"},
        {data1: "Sping"},
        {spung: "Gurke"}
    ]

    res.setHeader("Content-type", "application/json");
    res.send(json).status(200);
});

//Definieren auf welchem Port der Server Daten empfangen kann
//Damit wir wissen, wann der Server gestartet ist, triggern wir eine Callback Funktion, welche uns bescheid gibt, dass der Server gestartet ist
server.listen(port, () => {
    console.log(`Node.js Server is running on Port ${port}`);
});