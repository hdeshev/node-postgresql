//Use the native libpq bindings
var pg = require('pg').native;

var dbUrl = "tcp://nodetest:1234@localhost/nodetest";

function disconnectAll() {
    pg.end();
}

function testDate(onDone) {
    pg.connect(dbUrl, function(err, client) {
        client.query("SELECT NOW() as when", function(err, result) {
            console.log("Row count: %d",result.rows.length);  // 1
            console.log("Current year: %d", result.rows[0].when.getFullYear());

            onDone();
        });
    });
}

function testTable(onDone) {
    pg.connect(dbUrl, function(err, client) {
        client.query("CREATE TEMP TABLE reviews(id SERIAL, author VARCHAR(50), content TEXT)");
        client.query("INSERT INTO reviews(author, content) VALUES($1, $2)",
            ["mad_reviewer", "I'd buy this any day of the week!!11"]);
        client.query("INSERT INTO reviews(author, content) VALUES($1, $2)",
            ["calm_reviewer", "Yes, that was a pretty good product."]);
        client.query("SELECT * FROM reviews", function(err, result) {
            console.log("Row count: %d",result.rows.length);  // 1
            for (var i = 0; i < result.rows.length; i++) {
                var row = result.rows[i];
                console.log("id: " + row.id);
                console.log("author: " + row.author);
                console.log("content: " + row.content);
            }

            onDone();
        });
    });
}

testDate((function() {
    testTable(disconnectAll)
}));
