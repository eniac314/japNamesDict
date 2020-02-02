importScripts('/js/worker.js');

var app = Elm.Worker.init({flags :{ pathbase : "names", nbrFiles : 60 }});

self.addEventListener('message', function(e) {
  app.ports.inbound.send(e.data);
}, false);

app.ports.outbound.subscribe(function(data) {
  self.postMessage(data);
});