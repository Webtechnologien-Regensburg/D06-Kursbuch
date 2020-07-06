import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(
    import.meta.url));

const DATA_PATH = "data",
    DEMO_DATA_BASE_PATH = "demo_database.db.sql";

var db = null;

function create(database, callback) {
    open(database, function(error) {
        if (error === null) {
            console.log(__dirname);
            let demoDBPath = path.join(__dirname, DEMO_DATA_BASE_PATH),
                sqlStatements = fs.readFileSync(demoDBPath, "utf8");
            db.exec(sqlStatements, callback);
        }
    });
}

function open(database, callback) {
    if (db === null) {
        let dbPath = path.join(DATA_PATH, database);
        db = new sqlite3.Database(dbPath, callback);
    }
}

function close(database, callback) {
    if (db !== null) {
        db.close(callback);
        db = null;
    }
}

function run(query, callback) {
    db.all(query, function(error, rows) {
        if (error === null) {
            callback(rows);
        } else {
            callback(null);
        }
    });
}

export default {
    create: create,
    open: open,
    close: close,
    run: run,
};