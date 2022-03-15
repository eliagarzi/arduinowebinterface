const express = require("express");
const path = require("path");
const bodyParser = require("body-parser"); //Middleware, um das Body objekt im HTTP Request zu abstrahieren
const { red } = require("color-name");

const port = 3000; 
const server = express();

server.set("view engine", "ejs");

var urlencodedParser = bodyParser.urlencoded({ extended: false })

server.use(express.static(__dirname + '/source'));

/*
    HTTPRequest und HTTPResponse sind Objekte, die jegliche Eigenschaften zu den HTTP Responses und Requests speichern.

    So besitzt das Objbekt HTTPRequest z.B. die Eigenschaften

    httprequest.url = URL die Angefordert wird
    httprequest.method = HTTP Methode (Z.B. GET, POST, DELETE etc.)
    httprequest.headers = Jegliche Eigenschaften, die im Header des HTTP-Requests mitgesendet wurden
*/

server.post("/login", urlencodedParser, (httprequest, httpresponse) => {
    const input = {username: httprequest.body.username.trim(), password: httprequest.body.password.trim()}

    if (input.username === "admin" && input.password === "password") {
        httpresponse.render("index");
    } else {
        httpresponse.render("login", {message: 'Username oder Passwort ist falsch'});
    }
}); 

server.post("/api", (req, res) => {
    if (req.query.newarduino != undefined && req.query.newarduino != null) {
        console.log(req.query.newarduino)
    }
    
});


server.get("/", (req, res) => {
    res.render("index");
});

server.get("/login", (req, res) => {
    res.render("login.ejs", {message: ''})
});

server.get("/dashboard/download", (httprequest, httpresponse) => {
    httpresponse.download("./test.txt");
}); 

//Definieren auf welchem Port der Server Daten empfangen kann
//Damit wir wissen, wann der Server gestartet ist, triggern wir eine Callback Funktion, welche uns bescheid gibt, dass der Server gestartet ist


server.listen(port, () => {
    console.log("Node.js Server is running on Port " + port);
});
