/** File to generate query based on our DB */
const { getObjectId } = require("./mongoUtil");
const { getWholeWordRegex } = require("../utils/CommonUtil");

const generateDBQuery = queries => {
	let q = {};
	queries.forEach(query => {
		for (let i in query) {
			let value = getConvertedObjectId(i, query[i]);
			q[i] = value;			
		}
	})
	return q;
}

const getFormattedUpdateData = data => {
	return {
		$set : data
	}
}

const getConvertedObjectId = (key, value) => {
	return (key === "_id") ? getObjectId(value) : typeof(value) === 'string' ? getWholeWordRegex(value) : value;
}

const generateArrayQuery = query => {
	let q = {};
	query.forEach(que => {
		for (let key in que) {
			let arrQuery = {
				$all: [] // $all to find all the matching elements in an array ~ similar to $and
			};
			let values = que[key];
			if (typeof values[0] === 'string') {
				arrQuery.$all = value;
			}
			else {
				values.forEach(query => {
					// Using $elemMatch since it is an array of objects
					arrQuery.$all.push({
						$elemMatch: generateDBQuery([query])
					})
				})
			}
			q[key] = arrQuery;
		}
	});
	return q;
}

const DB = db => {

	let insertOne = dataObj => {
		let data = new db(dataObj);
		return data.save()
				.then(dbObj => dbObj.toObject())
				.catch(err => Promise.reject(err));
	}

	let findOne = (query = [], requirement = {}) => {
		query = generateDBQuery(query);
		return db.findOne(query, requirement)
				.then(data => data || false)
				.catch(err => Promise.reject(err));
	}

	let findMany = (query = [], requirement = {}) => {
		query = generateDBQuery(query);
		return db.find(query, requirement)
			.then(data => {
				return data;
			})
			.catch(err => Promise.reject(err));
	}

	let findByKeys = (query = [], requirement = {}) => {
		query = {
			$or: query
		};
		return db.findOne(query, requirement)
			.then(data => data || false)
			.catch(err => Promise.reject(err));
	}

	let findById = (ids = [], requirement = {}) => {
		ids = Array.isArray(ids) ? ids : [ids];
		ids = ids.map(id => getObjectId(id));
		let query = {
			_id : {
				$in : ids
			}
		}
		let aggreateArr = [
			{ $match : query }
		];
		Object.keys(requirement).length && aggreateArr.push({
			$project : requirement
		})
		return db.aggregate(aggreateArr)
					.then(data => data.length ? data : null)
					.catch(err => Promise.reject(err));
				
	}

	let findInArray = (query, requirement = {}) => {
		query = generateArrayQuery(query);
		return db.find(query, requirement)
				.then(data => data || null)
				.catch(err => Promise.reject(err));
	}

	let findAndUpdate = (findQuery, updateQuery, arrayFilters = [], unique = true) => {
		let method = unique ? 'findOneAndUpdate' : 'updateMany';
		return db[method](findQuery, updateQuery, { useFindAndModify : false, arrayFilters })
				.then(data => data)
				.catch(err => Promise.reject(err));
	}

	let updateOne = (query, data) => {
		query = generateDBQuery(query);
		data = getFormattedUpdateData(data);
		return db.updateOne(query, data, { new : true })
				.then(data => data)
				.catch(err => Promise.reject(err));
	}

	let deleteOne = query => {
		query = generateDBQuery(query);
		return db.deleteOne(query)
				.then(data => data)
				.catch(err => Promise.reject(err));
	}

	let getPaginatedList = obj => {
		let {
			limit = 20, 
			query, 
			requirements = {}, 
			isArrayQuery = false, 
			sortParams = {}, 
			formatQuery = true,
			isNested = false, 
			nestedArrayKey,
			lastValue : { key, value } = {},
			additionalReq
		} = obj;
		limit = +limit;
		let LIMIT = limit + 1 + (value ? 1 : 0); // Adding plus 1 to check if there is extra list available
		query = isArrayQuery ? generateArrayQuery(query) : formatQuery ? generateDBQuery(query) : query;
		if (isNested) {
			let arrayKey = `$${nestedArrayKey}`;
			let index = {
				$indexOfArray: [`${arrayKey}.${key}`, getConvertedObjectId(key, value)]
			}
			requirements[nestedArrayKey] = {
				$slice: [arrayKey, value ? index : 0, LIMIT]
			}
		}
		if (additionalReq) {
			requirements = { ...requirements, ...additionalReq };
		}
		return db.aggregate([
					{ $match : query },
					{ $project : requirements },
					{ $sort : sortParams },
					{ $limit : LIMIT },
				])
					.then(data => {
						let hasMore = false;
						if (data) {
							if (isNested) {
								data = data.length ? data[0][nestedArrayKey] : data;
								value && data.shift();
							};
							hasMore = (data && data.length) > limit;
							hasMore && data.pop();
						}
						return {
							data,
							hasMore
						}
					})
					.catch(err => Promise.reject(err))
	}

	return Object.freeze({
		insertOne,
		findOne,
		findByKeys,
		findMany,
		findById,
		findInArray,
		findAndUpdate,
		updateOne,
		deleteOne,
		getPaginatedList
	})
}

module.exports = DB;