const Config = {
    dbBaseRoute: "http://localhost:8080/db/",
    courseTemplate: document.querySelector("#class-list-entry-template").innerHTML.trim(),
    commentTemplate: document.querySelector("#comment-template").innerHTML.trim(),
    courseList: document.querySelector(".class-list"),
    courseDetails: document.querySelector(".class-details"),
};

Object.freeze(Config);

export default Config;