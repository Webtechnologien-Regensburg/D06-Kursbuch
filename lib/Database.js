import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

/**
 * Dieses Modul kümmert sich um den Zugriff auf die Datenbank, in der die Kursinformationen
 * und zugehörigen Kommentare gespeichert werden.
 *
 * Aufgaben des Moduls sind:
 *
 * - Öffnen der Datenbank beim Anwendungsstart
 * - Erstellen des Datenbank-Schemas falls notwendig
 * - Ausführen beliebiger SQL-Queries und Rückgabe der entsprechenden Ergebnisse
 */

/** 
 * Hinweis: Normalerweise können Sie in Node.js über die Variable __dirname auf den Ordner zugreifen,
 * in dem Ihr Skript ausgeführt wird. Da wir die alternative ES6-Modul-Syntax verwenden und unsere Projekt
 * entsprechend konfiguriert haben, steht uns __dirname nicht automatisch zur Verfügung. Die folgende Zeile
 * nutzt einige Funktionen der "path"- und "url"-Pakete um über einen anderen Weg an diese Information zu gelangen 
 * und manuell eine entsprechende Variable für den Zugriff auf den Ordnerpfad bereitzustellen.
 */
const __dirname = path.dirname(fileURLToPath(
    import.meta.url));

// Name des Unterordners, in dem die Datenbank gespeichert werden soll
const DATA_PATH = "data",
    // Datei (im aktuellen Verzeichnis) in der die SQL-Befehle zum Erstellen des Datenbankschemas gespeichert sind.
    DEMO_DATA_BASE_PATH = "demo_database.db.sql";

var db = null;

/**
 * Erzeugt eine neue Datenbank mit dem angegebene Namen und informiert über Aufruf des übergebenen Callbacks,
 * wenn die Datenbank vollständig zur Verfügung steht
 * @param  {string}   database Name der zu erstellenden Datenbank(-datei)
 * @param  {Function} callback Callback-Methode, die aufgerufen werden soll, wenn die Datenbank erstellt wurde
 
 */
function create(database, callback) {
    // Der Aufruf der open-Funktion sorgt dafür, dass die Datenbank initial erstellt oder, falls bereits vorhanden,
    // geöffnet wird. Diese Operation läuft asynchron ab, der übergebene Callback wird ausgeführt, wenn die Datenbank
    // zur Verfügung steht oder es Probleme beim Erstellen bzw. Öffnen der Datenbank gab.
    open(database, function(error) {
        // Die Callback-Methode (die vom sqlite3-Paket aufgerufen wird) erhält im Falle von aufgetretenen Problemen ein
        // error-Objekt übergeben. Ist dieser Wert null, bedeutet das, dass keine Fehler aufgetreten sind und wir die 
        // Datenbank nun nutzen können.
        if (error === null) {
            // Wir laden die SQL-Anweisungen zum Erstellen des Datenbankschemas aus der entsprechenden Datei ...
            let demoDBPath = path.join(__dirname, DEMO_DATA_BASE_PATH),
                sqlStatements = fs.readFileSync(demoDBPath, "utf8");
            // ... und führen diese dann in der geöffneten Datenbank aus.    
            db.exec(sqlStatements, callback);
        }
    });
}

/**
 * Öffnet eine SQLite-Datenbank in bzw. aus der übergebenen Datei und ruft nach Abschluss der Operation den übergebenen 
 * Callback auf. 
 */
function open(database, callback) {
    // Das Aufrufen dieser Methode ergibt nur dann Sinn, wenn noch keine Datenbank geöffnet wurde. Wir prüfen daher,
    // ob bereits ein Wert in der Variable db im Modul gespeichert wurde ...
    if (db === null) {
        // ... nur wenn das nicht der Fall ist, erstellen wir eine neue Datenbank und setzten dafür zuerst den Pfad
        // zur Datenbankdatei (data-Ordner + Dateiname) zusammen.
        let dbPath = path.join(DATA_PATH, database);
        // Die Datenbank selbst wird nun unter Rückgriff auf die vom sqlite3-Paket bereitgestellten Prototypen erzeugt. Der
        // Konstruktor bekommt den Callback übergeben, der ursprünglich an diese Methode übergeben wurde. Die Methode wird vom
        // sqlite3.Datebase-Konstruktor aufgerufen, sobald die Datenbank geöffnet wurde oder es beim Öffnen/Erstellen zu einem
        // Fehler gekommen ist.
        db = new sqlite3.Database(dbPath, callback);
    }
}

/**
 * Schließt die Datenbank und damit die Verbindung zur Datenbankdatei. Die Methode wird in diesem Beispiel nicht verwendet,
 * sollte in "richtigen" Anwendungen aber in den Anwendungsablauf integriert werden: Schließen Sie Ihre Datenbank, bevor Ihr
 * Server beendet wird, um sicherzustellen, dass alle Schreiboperationen korrekt beendet werden und Ihr Programm die Datenbankdatei
 * wieder freigibt.
 */
function close(database, callback) {
    if (db !== null) {
        db.close(callback);
        db = null;
    }
}

/**
 * Führt einen beliebigen SQL-Befehl in der Datenbank aus und gibt die Ergebnisse an die als Parameter spezifizierten Callback-Methode
 * zurück. Das Result Set wird als Array aus JavaScript-Objekten an den Callback übergeben, tritt beim Ausführen der Query ein Fehler auf,
 * wird der Wert null an den Callback übergeben.
 */
function run(query, callback) {
    // Das Ausführen der SQL-Anweisung (hier: query) erfolgt asynchron, d.h. wir warten auf die Generierung des Result Sets und werden über den 
    // hier als anonyme Funktion übergebenen Callback (function(error, rows) { ...) informiert, wenn ein Ergebnis vorliegt.
    db.all(query, function(error, rows) {
        // Wir prüfen, ob beim Ausführen ein Fehler aufgetreten ist ...
        if (error === null) {
            // ... und geben im positiven Fall das vollständige Result Set zurück
            callback(rows);
        } else {
            callback(null);
        }
    });
}

// Wir exportieren ein Objekt (hier in Literal-Schreibwiese, Vgl. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)
// mit allen Modul-Methoden, die für die anderen Komponenten unserer Anwendung zur Verfügung stehen sollen.
export default {
    create: create,
    open: open,
    close: close,
    run: run,
};