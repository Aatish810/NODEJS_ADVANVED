// const mongoose = require('mongoose');
// const requireLogin = require('../middlewares/requireLogin');

// const Blog = mongoose.model('Blog');


//   app.get('/api/blogs', requireLogin, async (req, res) => {
//     const redis = require('redis');
//     const redisUrl = 'redis://127.0.0.1:6379';
//     const client = redis.createClient(redisUrl);
//     const util = require('util');
    
//     client.get = util.promisify(client.get;

//     // Check if blogs already in cache
//     const blogPost = await client.get(req.user.id);
    
//     // If blogs avaliable return from here
//     if(blogPosts) {
//       return res.send(JSON.parse(blogPosts));
//     }

//     // If not in chache get from db and return db and store in chache for next time uses
//     const blogs = await Blog.find({ _user: req.user.id });
//     res.send(blogs);
//     client.set(req.user.id, JSON.stringify(blogs))
//   });
