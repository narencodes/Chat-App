const mongoose = require('mongoose');

let fileSchema = new mongoose.Schema({
	name : {
		type : String,
		required : true
	},
	size : {
		type : Number
	},
	buffer : {
		type : Buffer,
		required : true
	},
	type : {
		type : String,
		required : true
	}
})

const FileModel = mongoose.model('files', fileSchema);

module.exports = FileModel;