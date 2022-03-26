server.get("/api/arduino/all", (req, res) => {
    let jsonData = [
        {
            name: zh1,
            temp: 23,
            hum: 11
        },
        {
            name: arduino23,
            temp: 1245,
            hum: 333
        },
        {
            name: test,
            temp: 905,
            hum: 7
        }
    ]

    res.json(jsonData);
});