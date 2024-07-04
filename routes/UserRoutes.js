const express = require('express');
const router = express.Router();
const { createUser, doGetUser, loginUser, getAllUsers } = require('../controllers/UserController');
const basicAuth = require('../middleware/BasicAuth');
const sessionAuth = require('../middleware/SessionAuth');

router.post('/createUser', createUser);
router.post('/loginUser', loginUser);
router.get('/doGetUser/:mobile', sessionAuth, doGetUser); // Requires user session authentication
router.get('/admin/getAllUsers', basicAuth, getAllUsers); // Requires admin basic authentication

module.exports = router;
