const { clearHashKey } = require('../services/cache');

module.exports = async (req, res, next) => {
    
    await next();// This will  allow route to work and it will execute at last unlike other middlewares which execute first
    clearHashKey(req.user.id)
}