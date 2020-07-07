import Config from "../Config.js";

function sendDatabaseRequest(route, method, callback) {
    let url = Config.dbBaseRoute + route;
    fetch(url, { method: method }).then(function(response) {
        return response.json();
    }).then(function(result) {
        callback(result);
    });
}

class DatabaseClient {

    getClasses(callback) {
        sendDatabaseRequest("class", "GET", callback);
    }

    getCommentsFor(classID, callback) {
        let route = "class/" + classID + "/comments";
        sendDatabaseRequest(route, "GET", callback);
    }

    comment(classID, comment, callback) {
        let route = "class/" + classID + "/comments/" + encodeURIComponent(comment);
        sendDatabaseRequest(route, "PUT", callback);
    }

}

export default new DatabaseClient();