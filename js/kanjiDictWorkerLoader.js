importScripts('/js/kanjiDictWorker.js');

var app = Elm.KanjiDictWorker.init();

app.ports.saveToIndexedDb.subscribe(function(data) {
    addToDatabase(data);
});

app.ports.loadFromIndexedDb.subscribe(function(key) {
    if (!db) {
        console.log("indexedDB not working");
        app.ports.indexedDbStatus.send({
            indexedDbReady: false
        });
        return;
    }

    console.log("loading " + key + " from database");

    var request = db.transaction(['kanjiDict'])
        .objectStore('kanjiDict')
        .index('filename')
        .get(key);

    request.onerror = function(event) {
        console.log("Unable to retrieve " + key + " from database!");
        app.ports.loadedFromIndexedDb.send({
            error: request.error
        });
    };

    request.onsuccess = function(event) {

        if (request.result) {
            app.ports.loadedFromIndexedDb.send(request.result);
        } else {
            console.log("No data for " + key);
            app.ports.loadedFromIndexedDb.send({
                noData: key
            });
        }
    };
});

var request = self.indexedDB.open("kanjiDictDB", 2);

request.onerror = function(event) {
    console.log('The database failed opening');
};

var db;

request.onsuccess = function(event) {
    db = request.result;
    console.log('The database has opened successfully');
    app.ports.indexedDbStatus.send({
        indexedDbReady: true
    });
};

request.onupgradeneeded = function(event) {
    db = event.target.result;
    console.log('onupgradeneeded');

    var objectStore;

    if (!db.objectStoreNames.contains('kanjiDict')) {
        objectStore = db.createObjectStore('kanjiDict', {
            autoIncrement: true
        });
        objectStore.createIndex('filename', 'filename', {
            unique: true
        });
        objectStore.createIndex('content', 'content', {
            unique: false
        });
    }

    var transaction = event.target.transaction;

    transaction.oncomplete =
        function(event) {
            app.ports.indexedDbStatus.send({
                indexedDbReady: true
            });
        }
}



function addToDatabase(data) {
    if (!db) {
        console.log("indexedDB not working");
        return;
    }
    console.log("saving " + data.filename + " to database");
    var request = db.transaction(['kanjiDict'], 'readwrite')
        .objectStore('kanjiDict')
        .add({
            filename: data.filename,
            content: data.content
        });

    request.onsuccess = function(event) {
        console.log(data.filename + ' has been written successfully');
    };

    request.onerror = function(event) {
        console.log(data.filename + ' has not been written successfully: ' + request.error);
    };
}


self.addEventListener('message', function(e) {
  app.ports.inbound.send(e.data);
}, false);

app.ports.outbound.subscribe(function(data) {
  self.postMessage(data);
});