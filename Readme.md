# Das Kursbuch

In diesem Repository finden Sie eine Anwendung zur Demonstration einer einfachen Web-Anwendung auf Basis von Node.js, einer *SQLite*-Datenbank und einem HTML/JavaScript-CLient. NutzerInnen der Browser-Anwendung können einzelne Kurse der Medieninformatik auswählen und Kommentare zu diesen einsehen bzw. ergänzen. Die Kommentare werden server-seitig Dauerhaft in der SQLite-Datenbank gespeichert. Als Schnittstelle zwischen Server und Client dient eine einfache HTTP-Schnittstelle auf Basis des `express`-Pakets.

![Screenshot der fertigen Anwendung](docs/screenshot.png)

## Aufbau

...

### Datenbank

Beim Starten der Server-Anwendung wird eine Datei-basierte SQLite-Datenbank geöffnet. Das initale Datenbankschema inkl. Demo-Daten wird dabei automatisch auf Basis der Datei `lib\demo_database.db.sql` erzeugt:

``` sql
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "class" (
	"id"	INTEGER NOT NULL UNIQUE,
	"title"	TEXT,
	"description"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "comment" (
	"commentID"	INTEGER NOT NULL UNIQUE,
	"classID"	INTEGER,
	"comment"	TEXT,
	"createdAt"	NUMERIC,
	PRIMARY KEY("commentID")
);
INSERT INTO "class" VALUES (1,'Webtechnologien','In diesem Kurs werden Sie mit den wichtigsten Technologien zur Entwicklung von Webanwendungen vertraut gemacht.');
INSERT INTO "class" VALUES (2,'Multimedia Engineering','Sie vertiefen Ihre Software Engineering-Fähigkeiten und nutzten dabei den Browser als Anwendungsplattform.');
INSERT INTO "class" VALUES (3,'Mobile Apps für Android','Hier lernen Sie, einfache Anwendungen für Android-Geräte zu entwickeln.');
INSERT INTO "comment" VALUES (1,1,'Der beste Kurs an der Uni! Vor allem die Dozierenden sind toll!',1594054603);
INSERT INTO "comment" VALUES (2,1,'Da lernt man so einiges!',1593994545);
INSERT INTO "comment" VALUES (3,3,'Endlich kann ich Apps programmieren!',1593907785);
COMMIT;
```

## Installation

Um die Anwendung auszuprobieren, führen Sie die folgenden Schritte durch:

1. Installieren Sie die [aktuelleste Version von Node.js](https://nodejs.org/en/download/current/) für Ihr Betriebsystem.
2. Laden Sie die Anwendung [herunter](https://github.com/Webtechnologien-Regensburg/D06-Kursbuch/archive/master.zip).
3. Entpacken Sie das Archiv und öffnen Sie ein Terminal im Projektverzeichnis.
4. Installieren Sie per `npm install` alle notwendigen Abhängigkeiten.
5. Führen Sie die Anwendung per `npm start` aus und rufen Sie in Ihrem Browser die URL `http://localhost:8080` auf.

## Eigene Tests

Unter [dieser URL](https://github.com/Webtechnologien-Regensburg/D06-Kursbuch/archive/starter.zip) können Sie ein Starterpaket herunterladen, in dem Sie die wesentlichen Komponenten der Anwendung selbstständig implmentieren können. Die Struktur der Server- bzw. Client-Anwendung sowie das *User Interface* sind dabei vorgegeben.