importScripts('/js/nameDictWorker.js');

var app = Elm.NameDictWorker.init();

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

    var request = db.transaction(['nameDict'])
        .objectStore('nameDict')
        .index('filename')
        .get(key);

    request.onerror = function(event) {
        console.log("Unable to retrieve daa from database!");
    };

    request.onsuccess = function(event) {

        if (request.result) {
            app.ports.loadedFromIndexedDb.send(request.result);
        } else {
            app.ports.loadedFromIndexedDb.send({
                noData: key
            });
        }
    };
});

var request = window.indexedDB.open("japElmNames", 2);

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

    if (!db.objectStoreNames.contains('nameDict')) {
        objectStore = db.createObjectStore('nameDict', {
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
    var request = db.transaction(['nameDict'], 'readwrite')
        .objectStore('nameDict')
        .add({
            filename: data.filename,
            content: data.content
        });

    request.onsuccess = function(event) {
        console.log('The data has been written successfully');
    };

    request.onerror = function(event) {
        console.log('The data has not been written successfully');
    };
}


self.addEventListener('message', function(e) {
  app.ports.inbound.send(e.data);
}, false);

app.ports.outbound.subscribe(function(data) {
  self.postMessage(data);
});