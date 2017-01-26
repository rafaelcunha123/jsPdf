const jsPdf = require('node-jspdf')
const actions = require('./jsPdfExtension/actions.js')

let doc = jsPdf('l', 'mm', 'a4')


const settings = {
	headerFontSize: 8,
	headerFont: 'times',
	headerStyle: 'bold',
	contentFontSize: 10,
	blockDivisor: "|__",
	contentFontSize: 10,
	contentFont: 'times',
	contentFontStyle: 'normal',
	dateBlock: '|__|__| / |__|__| / |__|__|__|__|',
	leftMargin: 4
}

function createBlock(divisor, length) {
	let block = ''
	for (let i = 1; i <= length; i++) {
		block = block + divisor

	}
	block = block + "|"
	return block
}

actions.text(doc, {
		txtArray: ['GUIA  DE SERVICO PROFISSIONAL / SERVICO AUXILIAR DE', 'DIAGNOSTICO E TERAPIA - SP/SADT'],
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
			txtArray: ['12345678912345678912'],
			x: 251,
			y: 4,
			fontSize: 12,
		})
	})
	.then(input => {
		return actions.formBox(input.doc, {
			x: settings.leftMargin,
			y: 20,
			h: 10,
			w: 28,
			header: {
				text: '1 - Registro ANS',
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			},
			content: {
				text: createBlock('|__', 6),
				fontSize: settings.contentFontSize,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			}
		})
	})
	.then(input => {
		return actions.formBox(input.doc, {
			x: settings.leftMargin + 30,
			y: 20,
			h: 10,
			w: 88,
			header: {
				text: '3 - Numero da Guia Principal',
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			},
			content: {
				text: createBlock('|__', 20),
				fontSize: settings.contentFontSize,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			}
		})
	})
	.then(input => {
		return actions.formBox(input.doc, {
			x: settings.leftMargin,
			y: 32,
			h: 10,
			w: 43,
			header: {
				text: '4 - Data da Autorização',
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			},
			content: {
				text: settings.dateBlock,
				fontSize: settings.contentFontSize,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			}
		})
	})
	.then(input => {
		return actions.formBox(input.doc, {
			x: settings.leftMargin + 45,
			y: 32,
			h: 10,
			w: 87,
			header: {
				text: '5 - Senha',
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			},
			content: {
				text: createBlock('|__', 20),
				fontSize: settings.contentFontSize,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			}
		})
	})
	.then(input => {
		return actions.formBox(input.doc, {
			x: settings.leftMargin + 134,
			y: 32,
			h: 10,
			w: 43,
			header: {
				text: '6 - Validade da Senha',
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			},
			content: {
				text: settings.dateBlock,
				fontSize: settings.contentFontSize,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			}
		})
	})
	.then(input => {
		return actions.formBox(input.doc, {
			x: settings.leftMargin + 179,
			y: 32,
			h: 10,
			w: 87,
			header: {
				text: '7 - Numero da Gua Atribuido pela Operadora',
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			},
			content: {
				text: createBlock('|__', 20),
				fontSize: settings.contentFontSize,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			}
		})
	})
	.then(input => {
		return actions.text(input.doc, {
			txtArray: ['Dados do Beneficiario'],
			x: settings.leftMargin,
			y: 42,
			fontSize: settings.headerFontSize,
			fontStyle: settings.headerStyle,
			fontFamily: settings.headerFont,
		})
	})
	
	.then(input => {
		return actions.formBox(input.doc, {
			x: settings.leftMargin,
			y: 46,
			h: 10,
			w: 87,
			header: {
				text: '8 - Numero da Carteira',
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			},
			content: {
				text: createBlock('|__', 20),
				fontSize: settings.contentFontSize,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			}
		})
	})
	.then(input => {
		return actions.formBox(input.doc, {
			x: settings.leftMargin + 89,
			y: 46,
			h: 10,
			w: 43,
			header: {
				text: '9 - Validade da Carteira',
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			},
			content: {
				text: settings.dateBlock,
				fontSize: settings.contentFontSize,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			}
		})
	})
	.then(input => {
		return actions.formBox(input.doc, {
			x: settings.leftMargin + 134,
			y: 46,
			h: 10,
			w: 43,
			header: {
				text: '10 - Nome',
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			},
			content: {
				text: "",
				fontSize: settings.contentFontSize,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			}
		})
	})
	.then(actions.saveDoc)