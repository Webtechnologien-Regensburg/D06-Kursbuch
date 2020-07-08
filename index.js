/**
 * Das Kursbuch | Kommentar-Board zu Kursen der Medieninformatik
 * 
 * Diese Webanwendung gibt NutzerInnen die Möglichkeit, öffentliche, anonyme Kommentare zu Kursen der Medieninformatik zu verfassen.
 * Die Kursinformationen und Kommentare werden in einer Datenbank gespeichert, die von der serverseitigen Komponente verwaltet wird.
 * Eine Browser-Anwendung (HTML und CSS) erlaubt den Zugriff durch die NutzerInnen. Client und Server kommunizieren über eine 
 * HTTP-Verbindung. Im Client wird eine Liste aller Kurse angezeigt. Wählen die NutzerInnen einen Kurs aus, werden die vorhandenen
 * Kommentare angezeigt. NutzerInnen können dann beliebig viele eigene Kommentare ergänzen, die in der Datenbank gespeichert und im
 * Client angezeigt werden.
 
 * 
 * Dieses Modul stellt den Einstiegspunkt in die gesamte Webanwendung und die server-seitige Komponente 
 * der App dar. In diesem Modul werden:
 * 
 * - die SQLite-Datenbank initialisiert
 * - die HTTP-Schnittstellen zum Zugriff bzw. zur Kommunikation zwischen Client und Server erstellt
 * - der Client über einen Webserver zugänglich gemacht
 */

// Import des express-Frameworks (vorher per npm installiert) für die Gestaltung der HTTP-Schnittstelle und das verfügbar machen des Clients
// im Browser
import express from "express";
// Import des selbst implementierten Datenbank-Modul in dem alle relevanten Datenbank-Operationen ausgeführt werden
import Database from "./lib/Database.js";
// Dateiname der SQLite-Datenbank, die in der Anwendung verwendet wird
const DATABASE_NAME = "classes.sqlite",
    // Port, über den API und Client im Browser zugänglich sind
    HTTP_PORT = 8080;

var app;

function initDatabase() {
    // Öffnen bzw. Erstellen der Datenbank, ist dies erfolgreich, wird die als zweiter Parameter übergebene
    // Callback-Funktion ausgeführt und die restlichen Bestandteile der Anwendung werden initialisiert.
    Database.create(DATABASE_NAME, function() {
        console.log("Database opened and prepared with demo content");
        initExpress();
    });
}

// Erstellt eine einfache express-Anwendung, die den Client als Webseite anbietet und ein HTTP-Interface
// bereitstellt, über das der Client mit dem Server kommunizieren kann
function initExpress() {
    // Erstellen der express-App
    app = express();
    // Verweis auf Ordner mit Client-Code, der bereitgestellt werden kann
    app.use(express.static("app"));
    // Definieren einer HTTP-Route: wird die URL http://localhost:8080/db/class vom Client angefordert, wird die Methode onAllClassesRequested aufgerufen
    app.get("/db/class", onAllClassesRequested);
    // Wir können Platzhalte in den Routen definieren (hier :id), die vom Client mit beliebigen Werten (Parameter) ersetzt werden können
    app.get("/db/class/:id/", onClassRequested);
    app.get("/db/class/:id/comments", onCommentsRequestedForClass);
    app.put("/db/class/:id/comments/:comment", onCommentAddedForClass);
    // Starten der express-Anwendung auf dem definierten Port
    app.listen(HTTP_PORT, function() {
        // Diese Funktion wird aufgerufen, sobald die express-App erfolgreich gestartet worden ist
        console.log("Kursbuch server started, listening on " + HTTP_PORT);
    });
}

// Für jede mögliche HTTP-Anfrage an den Server wird eine Callback-Methode definiert, die ausgeführt wird, wenn die Route (durch einen Client) aufgerufen wird
// Die beiden Parameter-Objekte repräsentieren die Anfrage und potenzielle Antwort der HTTP-Kommunikation.
// Alle Methoden laufen in dieser Anwendung nach dem gleichen Schema ab: 
//   - Wir lesen die notwendigen Informationen aus der Anfrage aus (z.B. Parameter)
//   - Wir führen die notwendige Datenbankoperation aus
//   - Wir geben das Ergebnis als JSON-String an den anfragenden Client zurück
// Hier: Wir geben eine Liste aller Kurse zurück, die in der Datenbank gespeichert sind 
function onAllClassesRequested(request, response) {
    Database.run("SELECT * from class", function(result) {
        response.status(200).send(JSON.stringify(result));
    });
}

// Hier: Wir geben die Informationen zu dem Kurs zurück, der über die als Parameter übergebene ID identifiziert wird
function onClassRequested(request, response) {
    let id = request.params.id,
        query = "SELECT * FROM class WHERE id = " + id;
    Database.run(query, function(result) {
        response.status(200).send(JSON.stringify(result));
    });
}

// Hier: Wir geben einer Liste aller vorhandenen Kommentare zu dem Kurs zurück, der über die als Parameter übergebene ID identifiziert wird
function onCommentsRequestedForClass(request, response) {
    let id = request.params.id,
        query = "SELECT commentID, comment, createdAt FROM comment, class WHERE class.id = " + id + " AND class.id = comment.classID";
    Database.run(query, function(result) {
        response.status(200).send(JSON.stringify(result));
    });
}

// Hier: Wir fügen den als Parameter übergebenen Kommentar zu dem Kurs hinzu, der über die übergebene ID identifiziert wird. Den neu gespeicherten
// Kommentar, inkl. beim Einfügen in die Datenbank erstelltem Zeitstempel und ID, geben wir als Antwort auf die Anfrage an den Client zurück
function onCommentAddedForClass(request, response) {
    let id = request.params.id,
        comment = request.params.comment,
        now = Date.now(),
        query = "INSERT INTO comment (classID, comment, createdAt) VALUES (" + id + ", \"" + comment + "\", " + now + ")";
    Database.run(query, function() {
        query = "SELECT commentID, comment, createdAt FROM comment, class WHERE class.id = " + id + " AND class.id = comment.classID ORDER BY commentID DESC LIMIT 1";
        Database.run(query, function(result) {
            response.status(200).send(JSON.stringify(result));
        });
    });
}

initDatabase();