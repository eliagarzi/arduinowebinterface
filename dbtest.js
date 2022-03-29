db.serialize(function() {
    db.run("CREATE TABLE lorem (info TEXT)");
  
    var statement = db.prepare("INSERT INTO lorem VALUES (?)");
    for (var i = 0; i < 10; i++) {
        statement.run("Ipsum " + i);
    }
    statement.finalize();
  
    db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
        console.log(row.id + ": " + row.info);
    });
  });