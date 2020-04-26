const express = require('express');
const app = express();
const cluster = require('cluster');

// First Time Load
//Check if file is in master mode and create a child with fork so next time we have instances.
if(cluster.isMaster) {
    //When master is true in first this creates re-executes file in child mode.
    cluster.fork();
    // As many .fork() as many child instances
    // cluster.fork()
    // cluster.fork()
    // cluster.fork()
} else {

    function doNothing(num) {
        // This function creates a time delay of 5 secs hence blocking execution and delaying res of API and impact 
        // other API's as well. But with clustering when '/' route gets block with this function still '/fast' will 
        // get executed with another cluster
         const start = Date.now();
         while(Date.now - start < duration) {
             // Just for sometime 
         }
    }
    app.get('/', (req, res) => {
        doNothing(5000)
        res.send('Hello it took very long')
    });

    app.get('/fast', (req, res) => {
        res.send('Very fast to load');
    });
    
    app.listen(3000, () => {
        console.log('listening 3000');
    });

}

