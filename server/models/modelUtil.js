const mongoose = require('mongoose');

const transformFunc = (doc, ret) => {
     ret.id = ret._id;
     delete ret._id;
     return ret;
}

const defaultParams = {
     versionKey : false,
     toObject : {
          transform : transformFunc
     },
     toJSON : {
          transform : transformFunc
     }
}

module.exports = {
     getSchema : (schema, params = {}) => new mongoose.Schema(schema, { ...params, ...defaultParams }),
     getModel : mongoose.model,
     TYPES : {
          ...mongoose.Types,
          id : mongoose.Types.ObjectId
     }
}