import express from "express";
import Database from "./lib/Database.js";
const DATABASE_NAME = "classes.sqlite";
const HTTP_PORT = 8080;

var app;

function initDatabase() {
    Database.create(DATABASE_NAME, function() {
        console.log("Database opened and prepared with demo content");
        initExpress();
    });
}

function initExpress() {
    app = express();
    app.use(express.static("app"));
    app.get("/db/class", onAllClassesRequested);
    app.get("/db/class/:id/", onClassRequested);
    app.get("/db/class/:id/comments", onCommentsRequestedForClass);
    app.put("/db/class/:id/comments/:comment", onCommentAddedForClass);
    app.listen(HTTP_PORT, function() {
        console.log("Kursbuch server started, listening on " + HTTP_PORT);
    });
}

function onAllClassesRequested(request, response) {
    Database.run("SELECT * from class", function(result) {
        response.status(200).send(JSON.stringify(result));
    });
}

function onClassRequested(request, response) {
    let id = request.params.id,
        query = "SELECT * FROM class WHERE id = " + id;
    Database.run(query, function(result) {
        response.status(200).send(JSON.stringify(result));
    });
}


function onCommentsRequestedForClass(request, response) {
    let id = request.params.id,
        query = "SELECT commentID, comment, createdAt FROM comment, class WHERE class.id = " + id + " AND class.id = comment.classID";
    Database.run(query, function(result) {
        response.status(200).send(JSON.stringify(result));
    });
}

function onCommentAddedForClass(request, response) {
    let id = request.params.id,
        comment = request.params.comment,
        now = Date.now(),
        query = "INSERT INTO comment (classID, comment, createdAt) VALUES (" + id + ", \"" + comment + "\", " + now + ")";
    Database.run(query, function(result) {
        query = "SELECT commentID, comment, createdAt FROM comment, class WHERE class.id = " + id + " AND class.id = comment.classID ORDER BY commentID DESC LIMIT 1";
        Database.run(query, function(result) {
            response.status(200).send(JSON.stringify(result));
        });
    });
}

initDatabase();