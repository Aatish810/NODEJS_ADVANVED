const express = require('express');
const app = express();
const crypto = require('crypto');
// const worker = require('worker_threads').worker; -> internal library which comes with express by default.
// We can also use same.
       
const Worker = require('worker-thread').Worker;

app.get('/', (req, res) => {
    const worker = new Worker(function() {
        this.onmessage = function() {
            let counter = 0;
            while(counter < 1e9) {
                counter++;
            }
            postMessage(counter);
        };
    });

    Worker.onmessage = function(message) {
        console.log(message.data);
        res.send(`${message.data}`)
    }
    
    Worker.postMessage();
});

app.get('/fast', (req, res) => {
    res.send('Very fast to load');
});

app.listen(3000, () => {
    console.log('listening 3000');
});

/*PM2 is a Cluster manager which is used to dynamically generate cluster. based on our configuration
COMMANDS in PM2
0. npm install -g pm2
1. pm2 start file_name -i "no_of threads(usually defined 0 to ask pm2 to make decisions) -> START SERVER"
2. pm2  delete index -> STOP SERVER
3. pm2 list          -> GENERATE LIST OF CLUSTERS
4. pm2 show cluster_name         -> GENERATE MORE DETAILED OF WHAT IS HAPPENING INSIDE OF NAMED CLUSTER
5. pm2 monit         -> GENERATE A DASHBOARD FOR US TO CHECK ALL PROCESS AND CHECK WHAT IS HAPPENING*/