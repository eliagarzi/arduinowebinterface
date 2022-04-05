const express = require("express");
const port = 3000; 

//Eine neue Instanz des Express Objekt erstellen
const server = express();

//Die View Engine bestimmen, die Node.js nutzen soll
server.set("view engine", "ejs");

//Bestimmen wo Node für das rendern von EJS-Files statische files ziehen kann
server.use(express.static(__dirname + '/source'));

server.use(express.json());

/*
    HTTPRequest und HTTPResponse sind Objekte, die jegliche Eigenschaften zu den HTTP Responses und Requests speichern.

    So besitzt das Objbekt HTTPRequest z.B. die Eigenschaften

    httprequest.url = URL die Angefordert wird
    httprequest.method = HTTP Methode (Z.B. GET, POST, DELETE etc.)
    httprequest.headers = Jegliche Eigenschaften, die im Header des HTTP-Requests mitgesendet wurden
*/

server.post("/login", (httprequest, httpresponse) => {
    const input = {username: httprequest.body.loginemail, password: httprequest.body.loginpassword}

    if (input.username === "admin@local.com" && input.password === "password") {
        httpresponse.render("index");
    } else {
        httpresponse.render("login", {message: 'Username oder Passwort ist falsch'});
    }
}); 

server.post("/reset", (httprequest, httpresponse) => {
    const input = {username: httprequest.body.passwordresetemail}

    //Send Email

    if (input.username === "admin@local.com" && input.password === "password") {
        httpresponse.render("index");
    } else {
        httpresponse.render("login", {message: 'Username oder Passwort ist falsch'});
    }
});

server.get("/index", (httprequest, httpresponse) => {
    httpresponse.render("index");
});

server.get("/login", (req, res) => {
    res.render("login", {message: ''})
});

server.post("/user/reset", (req, res) => {
    console.log("ts")
    let randomString = crypto.randomBytes(30).toString("hex");
    serverCache.set(randomString, req.body.email, 600);
    console.log(randomString)
    res.json({link: `http://127.0.0.1:3000/user/reset/?link=${randomString}`})
})

server.get("/user/reset/", (req, res) => {
    let randomString = req.query.link;
    
    if(serverCache.get(randomString) != undefined && serverCache.get(randomString) !== null) {
        res.render("reset");
    } else {
        res.send("Link ist ungültig");
    }
});

server.post("/user/reset/", (req, res) => {
    let randomString = req.query.link;
    console.log("password reset")
    console.log(randomString)
    if(serverCache.get(randomString) != undefined && serverCache.get(randomString) !== null) {
        console.log(req.body.password)
        serverCache.del(randomString);
        res.send("<h1>Erfolgreich</h1>")        
    } else {
        res.send("Link ist ungültig");
    }
})

//Definieren auf welchem Port der Server Daten empfangen kann
//Damit wir wissen, wann der Server gestartet ist, triggern wir eine Callback Funktion, welche uns bescheid gibt, dass der Server gestartet ist
server.listen(port, (error) => {
    if(error) {
        console.error(error)
    } else {
        console.log(`Node.js Server is running on Port ${port}`);
    }
});