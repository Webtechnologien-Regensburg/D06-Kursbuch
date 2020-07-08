import DatabaseClient from "./database/DatabaseClient.js";
import CourseView from "./ui/CourseView.js";

function init() {
    CourseView.setOnCourseSelectedListener(onCourseSelected);
    CourseView.setOnCommentCreatedListener(onCommentCreated);
    loadCourseList();
}

function loadCourseList() {
    DatabaseClient.getClasses(function(result) {
        CourseView.addCourses(result);
    });
}

function onCourseSelected(courseID) {
    DatabaseClient.getCommentsFor(courseID, function(result) {
        CourseView.clearComments();
        CourseView.addComments(result);
    });
}

function onCommentCreated(comment) {
    DatabaseClient.comment(comment.classID, comment.comment, function(result) {
        CourseView.addComments(result);
    });
}

init();