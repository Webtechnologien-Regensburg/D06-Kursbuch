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
