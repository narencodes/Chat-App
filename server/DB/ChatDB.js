const ChatModel = require("../models/ChatModel");

const ChatDB = require('./util')(ChatModel);

module.exports = ChatDB;