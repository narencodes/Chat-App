const FileModel = require("../models/FileModel");

const FileDB = require('./util')(FileModel);

module.exports = FileDB;