const CLASS_LIST_SELECTOR = ".class-list",
    CLASS_LIST_ENTRY_TEMPLATE_SELECTOR = "#class-list-entry-template",
    CLASS_TEMPLATE = document.querySelector(CLASS_LIST_ENTRY_TEMPLATE_SELECTOR).innerHTML
    .trim();

function onClassListItemClicked(event) {
    let target = event.originalTarget;
    if (!target.classList.contains("entry")) {
        target = target.parentElement;
    }
    this.clearSelection();
    target.classList.add("selected")
    this.listener(target.getAttribute("data-id"));
}

class ClassList {

    constructor(el) {
        this.listEl = document.querySelector(el);
    }

    addClickEventListener(listener) {
        this.listener = listener;
    }

    clearSelection() {
        let classElements = this.listEl.querySelectorAll(".entry");
        for (let i = 0; i < classElements.length; i++) {
            classElements[i].classList.remove("selected");
        }
    }

    add(newClass) {
        let el = document.createElement("div"),
            content = CLASS_TEMPLATE;
        content = content.replace("$DATA_ID", newClass.id);
        content = content.replace("$TITLE", newClass.title);
        content = content.replace("$DESCRIPTION", newClass.description);
        el.innerHTML = content;
        el.firstChild.addEventListener("click", onClassListItemClicked.bind(this));
        this.listEl.append(el.firstChild);
    }

    getClassByID(id) {
        let el = this.listEl.querySelector("[data-id=\"" + id + "\"]");
        return {
            id: id,
            title: el.querySelector(".title").innerHTML,
            description: el.querySelector(".description").innerHTML,
        };
    }

}

export default new ClassList(CLASS_LIST_SELECTOR);