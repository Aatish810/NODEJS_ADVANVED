// NESTED HASHED OBJECTS
const mongoose = require('mongoose');
const redis = require('redis');

const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);

client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

// Making a new property so that we can call exe on specific api call only having .cache() attached with them.
mongoose.Query.prototype.cache = function(option = {}) {
    this._cache = true;
    this._hashKey = JSON.stringify(option.key || '')
    return this;
}

mongoose.Query.prototype.exec = async function () {

    // Check if cache()  if attached to query or not
    if(!this._cache) {
        return exec.apply(this, arguments);
    }

    // Function that we want to execute before any query runs in our application
    // We can get query param whic is called to filter data what is executed using -> this.getQuery()
    // We can aslo get name of collection on cheich this query is executed - > this.mongooseCollection.name;
    // These properties can be used to create unique keys to set
    // DONOT CHANGE DIRECT PARAMS AS IT WILL ALTER QUERY. INSTEAD CREATE COPY AND USE IT FOR KEY

    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }));

    const cacheValue = await client.hget(this._hashKey, key);
    if (cacheValue) {
        const doc = JSON.parse(cacheValue);
        return Array.isArray(doc)
            ? doc.map(d => new this.model(d))
            : new this.model(doc);
    }

    const result = await exec.apply(this, arguments);
    client.hset(this._hashKey, key, JSON.stringify(result), 'EX', 10, () =>{})
    return result;
}

// Export function to clear all cache using key
module.exports = {
    clearHashKey(hash) {
        client.del(JSON.stringify(hash))
    }
}


