/** This file contains common functionalities */

let getWholeWordRegex = lookup => {
	return new RegExp("^" + lookup + "$", 'i')
}

// To compare two object ids
let checkIfSameId = (id1, id2) => {
	return id1.toString() === id2.toString();
}

module.exports = {
	getWholeWordRegex,
	checkIfSameId
}