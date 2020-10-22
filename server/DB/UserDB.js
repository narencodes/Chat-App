const User = require('../models/UserModel');

const UserDB = require('./util')(User);

module.exports = UserDB;