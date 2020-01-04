const jwt = require('jsonwebtoken')
exports.veryfyJWT = async token => {
    if (!token) {
        return {error : true, reason: 'no token provided' };
    }
    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        return { error : false, ...decoded };
    } catch (err) {
        return { error : true, reason: 'invalid token'};
    }
}