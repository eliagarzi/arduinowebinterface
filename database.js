//Um mit SQLite zu arbeiten, müssen wird das entsprechende Modul importieren
const sqllite = require("sqlite3"); 

/*
    Erstellen eines JavaScript Objektes, welche unsere SQLite Datenbank repräsentiert
    Falls ein Fehler auftritt wird dieser als Error-Objekt "err" an die Callback Funktion weitergegeben
*/

let db = new sqllite.Database("arduino.db", (err) => {  
    if (err) {
        return console.error(err.message);
    } else {
        console.log ("Verbindung mit der SQLite Datenbank erfolgreich hergestellt.");
    }
});

/* 
    Überprüfen ob Table exisitert -> Wenn nicht -> Eine erstellen 
*/

db.run('CREATE TABLE USERS');

db.run(`INSERT INTO USERS VALUES 123`, function(err) {
    if (err) {
        console.log(`Fehler beim schreiben in die Datenbank ${err}`)
    } 
    else {
        console.log(`Erfolgreich in die Datenbank gespeichert`)
    }
});

let sql = `SELECT * FROM USERS`;

db.all(sql,(err, rows ) => {
    if (err) {
        throw err;
      }
      rows.forEach((row) => {
        console.log(row.name);
      });
});

/*
    Datenbank schliessen -> Best Practice
    Falls ein Fehler auftritt wird dieser als Error-Objekt "err" an die Callback Funktion weitergegeben
*/

db.close((err) => {
    if (err) {
        return console.error(err.message);
    } else {
        console.log ("Verbindung mit der SQLite Datenbank erfolgreich geschlossen.");
    }
}); 

