const basicAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'No credentials provided' });
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (username === 'admin' && password === 'password') {
        req.userType = 'admin';
        next();
    } else {
        return res.status(403).json({ message: 'Forbidden' });
    }
};

module.exports = basicAuth;
