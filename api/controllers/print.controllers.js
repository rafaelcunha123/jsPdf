const fs = require('fs')
const path = require('path')
const forms = require('../tissForms')

exports.controller = function(req, res) {
	forms.spSadt({
			hello: 'hello'
		})
		.then((doc) => {
			const filePath = path.join(__dirname, '../savedPdfs/', doc.uuid)
			console.log('path', filePath)


			res.download(filePath, doc.uuid, (err)=>{
				if(err) console.log(err)
					else console.log('hooray!')
			})


		}).catch((e)=>{
			console.log(e)
		})
}









			//res.sendFile(path.join(__dirname, '../savedPdfs/', doc.uuid))
			//fs.readFile(path.join(__dirname, '../savedPdfs/', doc.uuid), function(err, data) {})
				//console.log('doc',doc)

			//res.download(path.join(__dirname, '../savedPdfs/', doc.uuid))

/*			const base64String = buf.toString('base64')
*/		/*	const file = fs.createReadStream(filePath, { encoding: 'base64' });
			const stat = fs.statSync(path.join(__dirname, '../savedPdfs/', doc.uuid));
			res.setHeader('Content-Length', stat.size);
			res.setHeader('Content-Type', 'application/pdf');
			res.setHeader('Content-Disposition', 'attachment; filename='+doc.uuid);
			file.pipe(res)*/
			//request(req.url).pipe(res)