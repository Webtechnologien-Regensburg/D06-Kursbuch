import Config from "../Config.js";

const ONE_SECOND_IN_MS = 1000;

var courseListEl = Config.courseList,
    commentListEl = Config.courseDetails.querySelector("ul"),
    commentTextEl = Config.courseDetails.querySelector("textarea"),
    onCourseSelectedListener,
    onCommentCreatedListener;

Config.courseDetails.querySelector(".class-details input[type=\"submit\"]").addEventListener(
    "click", onAddCommentButtonClicked);

function dateFromTimestamp(timestamp) {
    let date = new Date(timestamp * ONE_SECOND_IN_MS);
    return date;
}

function createCourseElement(course) {
    let el = document.createElement("div"),
        content = Config.courseTemplate;
    content = content.replace("$DATA_ID", course.id);
    content = content.replace("$TITLE", course.title);
    el.innerHTML = content;
    return el.firstChild;
}

function createCommentElement(comment) {
    let el = document.createElement("div"),
        content = Config.commentTemplate;
    content = content.replace("$DATA_ID", comment.commentID);
    content = content.replace("$ID", comment.commentID);
    content = content.replace("$DATE", dateFromTimestamp(comment.createdAt));
    content = content.replace("$TEXT", comment.comment);
    el.innerHTML = content;
    return el.firstChild;
}

function clearSelection() {
    let classElements = courseListEl.querySelectorAll(".entry");
    for (let i = 0; i < classElements.length; i++) {
        classElements[i].classList.remove("selected");
    }
}

function onCourseItemClicked(event) {
    let target = event.originalTarget;
    if (!target.classList.contains("entry")) {
        target = target.parentElement;
    }
    clearSelection();
    target.classList.add("selected");
    onCourseSelectedListener(target.getAttribute("data-id"));
}

function onAddCommentButtonClicked() {
    let text = commentTextEl.value,
        id = courseListEl.querySelector(".selected").getAttribute("data-id");
    if (text !== "") {
        onCommentCreatedListener({
            classID: id,
            comment: text,
        });
    }
    commentTextEl.value = "";
}

class CourseView {

    addCourses(courses) {
        for (let i = 0; i < courses.length; i++) {
            let el = createCourseElement(courses[i]);
            el.addEventListener("click", onCourseItemClicked);
            courseListEl.append(el);
        }
    }

    clearComments() {
        commentListEl.innerHTML = "";
    }

    addComments(comments) {
        for (let i = 0; i < comments.length; i++) {
            let el = createCommentElement(comments[i]);
            commentListEl.append(el);
        }
        this.showDetails();
    }

    showDetails() {
        Config.courseDetails.classList.remove("hidden");
    }

    hideDetails() {
        Config.courseDetails.classList.add("hidden");
    }

    setOnCourseSelectedListener(listener) {
        onCourseSelectedListener = listener;
    }

    setOnCommentCreatedListener(listener) {
        onCommentCreatedListener = listener;
    }

}

export default new CourseView();