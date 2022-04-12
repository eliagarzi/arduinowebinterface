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

server.get("/login", (req, res) => {
    res.render("login", {message: ''})
});

server.post("/user/reset", (req, res) => {
    console.log("ts")
    let randomString = crypto.randomBytes(30).toString("hex");
    serverCache.set(randomString, req.body.email, 600);
    console.log(randomString)
    res.json({link: `http://127.0.0.1:3000/user/reset/?link=${randomString}`})
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

server.get("/user/reset/", (req, res) => {
    let randomString = req.query.link;
    
    if(serverCache.get(randomString) != undefined && serverCache.get(randomString) !== null) {
        res.render("reset");
    } else {
        res.send("Link ist ungültig");
    }
});

