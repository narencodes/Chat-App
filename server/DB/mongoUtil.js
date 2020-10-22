const ObjectId = require('mongodb').ObjectID;

const getObjectId = value => {
	if (!value.toString().match(/^[0-9a-fA-F]{24}$/)) {
		return value;
	}
	return ObjectId(value);
}

module.exports = {
	getObjectId
}