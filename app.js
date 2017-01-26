const jsPdf = require('node-jspdf')
const actions = require('./jsPdfExtension/actions.js')

let doc = jsPdf('l', 'mm', 'a4')


const settings = {
	headerFontSize: 6,
	headerFont: 'times',
	headerStyle: 'bold',
	contentFontSize: 9,
	contentFont: 'times',
	contentFontStyle: 'normal',
	blockDivisor: "|__",
	dateBlock: '|__|__| / |__|__| / |__|__|__|__|',
	leftMargin: 3
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
			h: 7.28,
			w: 26,
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
			x: settings.leftMargin + 27,
			y: 20,
			h: 7.28,
			w: 78,
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
			y: 29,
			h: 7.28,
			w: 39,
			header: {
				text: '4 - Data da Autorizacao',
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
			x: settings.leftMargin + 40,
			y: 29,
			h: 7.28,
			w: 80,
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
			x: settings.leftMargin + 122,
			y: 29,
			h: 7.28,
			w: 39,
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
			x: settings.leftMargin + 163,
			y: 29,
			h: 7.28,
			w: 78,
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
		return actions.formBox(input.doc, {
			x: settings.leftMargin,
			y: 38,
			h: 3,
			w: 288,
			header: {
				text: 'Dados do Beneficiario',
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
				padding: 0,
			},
			style: {
				fill: {
					R: 192,
					G: 192,
					B: 192,
				},
				borderColor: {
					R: 0,
					G: 0,
					B: 0,
				}
			}
		})
	})
	.then(input => {
		return actions.formBox(input.doc, {
			x: settings.leftMargin ,
			y: 43,
			h: 7.28,
			w: 78,
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
			x: settings.leftMargin + 79,
			y: 43,
			h: 7.28,
			w: 39,
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
			x: settings.leftMargin + 119,
			y: 43,
			h: 7.28,
			w: 86,
			header: {
				text: '10 - Nome',
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			},
			content: {
				text: "",
			}
		})
	})
	.then(input => {
		return actions.formBox(input.doc, {
			x: settings.leftMargin + 206,
			y: 43,
			h: 7.28,
			w: 60,
			header: {
				text: '11 - Cartao Nacional de Saude',
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			},
			content: {
				text: createBlock('|__', 15),
				fontSize: settings.contentFontSize,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			}
		})
	})
	.then(input => {
		return actions.formBox(input.doc, {
			x: 297 - 2*settings.leftMargin + -21.33,
			y: 43,
			h: 7.28,
			w: 21.33,
			header: {
				text: '12 - Atendimento RN',
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			},
			content: {
				text: "  	"+ createBlock('|__', 1),
				fontSize: settings.contentFontSize,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			}
		})
	})
	.then(actions.saveDoc)