const fs = require('fs')
const path = require('path')
const validator = require('../validators')
const builder = require('../builders')
	//const forms = require('../tissForms')

exports.controller = function(req, res) {
	const dataObject = {
		body: req.body,
		url: req.url.slice(1, req.url.length).toLowerCase()
	}

	validator.validateSchema(dataObject)
		.then(validData => {
			if (!builder[dataObject.url]) {
				Promise.reject(dataObject.url + ' pdf not supported')
			} else {
				return builder[dataObject.url](validData)
			}
		}).then((doc) => {
			//res.send('OK')

			const filePath = path.join(__dirname, '../builders/savedPdfs/', doc.uuid)
			console.log('path', filePath)

			res.download(filePath, doc.uuid, (err) => {
				if (err) console.log(err)
				else console.log('hooray!')
			})
		}).catch((e) => {
			console.log(e)
			res.json(e.message ? e.message : e)
		})
}