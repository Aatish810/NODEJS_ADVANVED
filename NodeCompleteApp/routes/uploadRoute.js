const AWS = require('aws-sdk');
const keys = require('../config/keys');
const requireLogin = require('../middlewares/requireLogin');
const uuid = require('uuid/v1');

const s3 = new AWS.S3({
    accessKeyId: keys.awsAccessKey,
    secretAccessKey: keys.aswSecretKey
})

module.exports = app => {
app.get('/api/upload', requireLogin, (req, res) =>{
    const key = `${req.user.id}/${uuid()}.jpeg`;

    s3.getSignedUrl('putObject', {
        Bucket: 'aws_unique_s3_name',
        ContentType: 'image/jpeg',
        Key: key
    }, (err, url) => res.send({ key, url }))
    });
}