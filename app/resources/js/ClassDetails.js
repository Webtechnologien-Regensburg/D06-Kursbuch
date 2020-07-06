const CLASS_DETAIL_SELECTOR = ".class-details",
    INPUT_BUTTON_SELECTOR = ".class-details input[type=\"submit\"]",
    COMMENT_TEXTAREA_SELECTOR = ".class-details textarea",
    COMMENT_TEMPLATE_SELECTOR = "#comment-template",
    COMMENT_TEMPLATE = document.querySelector(COMMENT_TEMPLATE_SELECTOR).innerHTML
    .trim();


function dateFromTimestamp(timestamp) {
    let date = new Date(timestamp * 1000);
    return date;
}

function onCommentAddedButtonClicked() {
    let text = document.querySelector(COMMENT_TEXTAREA_SELECTOR).value;
    if (text !== "") {
        this.listener(text);
    }
}

class ClassDetails {

    constructor(el) {
        this.el = document.querySelector(el);
        this.listEl = this.el.querySelector("ul");
        document.querySelector(INPUT_BUTTON_SELECTOR).addEventListener("click", onCommentAddedButtonClicked.bind(this));
    }

    addCommentCreatedListener(listener) {
        this.listener = listener;
    }

    clear() {
        this.listEl.innerHTML = "";
    }

    add(comment) {
        let el = document.createElement("div"),
            content = COMMENT_TEMPLATE;
        content = content.replace("$DATA_ID", comment.id);
        content = content.replace("$DATE", dateFromTimestamp(comment.createdAt));
        content = content.replace("$TEXT", comment.comment);
        el.innerHTML = content;
        this.listEl.append(el.firstChild);
        this.el.classList.remove("hidden");
    }

}

export default new ClassDetails(CLASS_DETAIL_SELECTOR);