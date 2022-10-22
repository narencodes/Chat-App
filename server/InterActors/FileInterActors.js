const FileDB = require("../DB/FileDB");
const fs = require('fs');
const { isValidObjectId } = require("mongoose");

const getDataURL = file => {
     return new Promise((resolve, reject) => {
          fs.readFile(file.path, function(err, data) {
               if (err) return reject();
               resolve(data); 
          })
     });
}

const insertFileToDB = async (file) => {
     let binary = await getDataURL(file);
     let fileObj = {
          name : file.name,
          buffer : binary,
          type : file.type,
          size : file.size
     }
     
     return FileDB.insertOne(fileObj);
}

// Upload the files and send the file urls as Array or String
const uploadFiles = images => {
     // For Multiple files
     let files = images.length ? images : [ images ];
     let fileIds = [];
     // Wait for all files to be inserted into DB
     let promiseArray = files.map(file => {
          return insertFileToDB(file)
                    .then((fileObj) => {
                         fileIds.push(fileObj._id)
                    });
     });
     
     return Promise.all(promiseArray)
                    .then(() => {
                         return images.length ? fileIds : fileIds[0]
                    })
                    .catch(err => Promise.reject(err));
}

const fetchFile = id => {
     if (!isValidObjectId(id)) {
          return Promise.reject({
               code : "p404",
               message : "Invalid file id"
          }) 
     }
     
     return FileDB.findById(id)
			.then(data => {
                    if (!data) {
                         return {
                              code : 400,
                              message : "f404"
                         };
                    }
                    data = data[0];
				return {
                         status : 200,
					data : data.buffer.buffer,
					headers : {
                              "Content-Type" :  data.type,
                              "Cache-Control" :  `max-age=${1000 * 60 * 60 * 24 * 10}` // Cache the image for 10 days in client browser
                         },
                         isBuffer : true
				}
			})
			.catch(err => {
                    console.log(err);
                    return {
                         status : 500
                    }
			});
}

const deleteFile = ids => {
     let fileIds = Array.isArray(ids) ? ids : [ ids ];
     let promiseArray = fileIds.map(id => {
          return FileDB.deleteById(id);
     });
     return Promise.all(promiseArray);
}


module.exports = {
     uploadFiles,
     fetchFile,
     deleteFile
}