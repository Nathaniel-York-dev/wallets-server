const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class SessionHelper {
    static createSession(user) {
        const token = jwt.sign({user}, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });
        return crypto.createHash('sha256').update(token).digest('base64');
    }
    static verifySession(hash, user) {
        const hashed = this.createSession(user);
        return hashed === hash;
    }
}
exports.SessionHelper = SessionHelper;
