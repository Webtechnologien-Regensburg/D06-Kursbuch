import DatabaseClient from "./DatabaseClient.js";
import ClassList from "./ClassList.js";
import ClassDetails from "./ClassDetails.js";

var currentClassID;

function init() {
    loadClassList();
}

function loadClassList() {
    DatabaseClient.getClasses(function(result) {
        for (let i = 0; i < result.length; i++) {
            ClassList.add(result[i]);
        }
        ClassList.addClickEventListener(onClassListItemClicked);
        ClassDetails.addCommentCreatedListener(onCommentAdded);
    });
}

function showCommentsForCurrentClass() {
    DatabaseClient.getCommentsFor(currentClassID, function(result) {
        ClassDetails.clear();
        for (let i = 0; i < result.length; i++) {
            ClassDetails.add(result[i]);
        }
    });
}

function onClassListItemClicked(classID) {
    currentClassID = classID;
    showCommentsForCurrentClass();
}

function onCommentAdded(comment) {
    DatabaseClient.comment(currentClassID, comment, function(result) {
        ClassDetails.add(result[0]);
    });
}


init();