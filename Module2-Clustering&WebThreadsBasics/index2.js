process.env.UV_THREADPOOL_SIZE = 1;
const cluster = require('cluster');

// First Time Load
//Check if file is in master mode and create a child with fork so next time we have instances.
if (cluster.isMaster) {
    //When master is true in first this creates re-executes file in child mode.
    cluster.fork();
    cluster.fork()
    // As many .fork() as many child instances
    // cluster.fork()
    // cluster.fork()
    // cluster.fork()
} else {

    const express = require('express');
    const app = express();
    const crypto = require('crypto');

    app.get('/', (req, res) => {
        crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
            res.send('Hello it took very long')
        });
    });

    app.get('/fast', (req, res) => {
        res.send('Very fast to load');
    });

    app.listen(3000, () => {
        console.log('listening 3000');
    });

}

/* NOTE POINTS - We cannot have as many clusters as many we want. It Simply doesnot improve our performance. 
Clusters defined must be based on your logical processor or your computer processor. Lets say we have a dual code
procesor any we make multiple forks it will reduce our performance, yes it will be better than that of single fork
but if we use 2 fork for dual processor it may be a better solution. Point here is it depends on our machine and 
logic and we must not blindly fork() */

