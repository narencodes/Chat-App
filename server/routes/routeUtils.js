const express = require("express");
const formidable = require('express-formidable')({
    multiples : true //To support multiple file uploads
});

let jsonParser = express.json({ limit: "50mb" }); // Express json middleware to parse application/json

const getParser = () => {
    return (req, res, next) => {
        let requestContentType = req.get('content-type') || '';
        // For forms use formidable middleware else use
        if (requestContentType.includes('multipart/form-data')) {
            return formidable(req, res, next);
        }
        return jsonParser(req, res, next);
    }
}

module.exports = {
    getParser
}