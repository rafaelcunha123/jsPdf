const jsPdf = require('node-jspdf')
const actions = require('./jsPdfExtension/actions.js')

let doc = jsPdf('l', 'mm', 'a4')

actions.text(doc, {
		txtArray:  ['GUIA  DE SERVICO PROFISSIONAL / SERVICO AUXILIAR DE', 'DIAGNOSTICO E TERAPIA - SP/SADT'],
		align: 'center',
		fontSize: 12,
		fontFamily: 'times',
		fontStyle: 'bold',
		y: 2.66,
	})
	.then(input => {
		return actions.text(input.doc, {
			txtArray: ['No. Guia no Prestador'],
			x: 224.36,
			y: 2.66,
			fontSize: 7,
		})
	})
	.then(input => {
		return actions.text(input.doc, {
			txtArray:  ['12345678912345678912'],
			x: 251,
			y: 4,
			fontSize: 12,
		})
	})
	.then(actions.saveDoc)
