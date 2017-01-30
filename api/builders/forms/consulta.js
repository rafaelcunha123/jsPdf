const jsPdf = require('node-jspdf')
const _ = require('lodash')
const moment = require('moment')
const actions = require('../helper/jsPdfHelper.js')



function createBlock(divisor, length) {
	let block = ''
	for (let i = 1; i <= length; i++) {
		block = block + divisor

	}
	block = block + "|"
	return block
}

function formatDate(dateString) {
	const thisDate = moment(dateString, 'YYYY-MM-DD')
	const day = ("0" + thisDate.date()).slice(-2)
	const month = ("0" + (thisDate.month() + 1)).slice(-2)
	const formatDate = day + '/' + month + '/' + thisDate.year()
	return formatDate
}

function findDadosIdentificacao(identification) {
	if (identification.cpfContratado) return identification.cpfContratado
	if (identification.cnpjContratado) return identification.cnpjContratado
	if (identification.codigoPrestadorNaOperadora) return identification.codigoPrestadorNaOperadora
	return undefined
}

function buildTextArray(text, lineLength, maxLines) {
	lineLength = lineLength || 160
	const array = text.match(/(.|[\r\n]){1,167}/g)
	console.log(array)

	maxLines = maxLines || array.length
	return array.slice(0, maxLines)
}


exports.consulta = function(validData) {

	const data = _.has(validData, 'guiaConsulta') ? validData.guiaConsulta : {}

	let doc = jsPdf('l', 'mm', 'a4')
	const settings = {
		headerFontSize: 10,
		headerFont: 'times',
		headerStyle: 'bold',
		headerPadding: 1,
		contentFontSize: 12,
		contentFont: 'times',
		contentFontStyle: 'normal',
		contentPadding: 1,
		blockDivisor: "|__",
		dateBlock: '|__|__| / |__|__| / |__|__|__|__|',
		dateBlockLarge: '|___|___| / |___|___| / |___|___|___|___|',
		intervalBlock: '|__|__|:|__|__| a |__|__|:|__|__|',
		leftMargin: 3,
	}

	return actions.text(doc, {
			txtArray: ['GUIA  DE CONSULTA'],
			align: 'center',
			fontSize: 16,
			fontFamily: 'times',
			fontStyle: 'bold',
			y: 10,
			lineSpacing: 0.01,
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: ['2-No. Guia no Prestador'],
				x: 205,
				y: 9,
				fontSize: 9,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: _.has(data, 'cabecalhoConsulta.numeroGuiaPrestador') ? data.cabecalhoConsulta.numeroGuiaPrestador : "",
				x: 240,
				y: 11,
				fontSize: 14,
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin,
				y: 33,
				h: 12.5,
				w: 35,
				header: {
					text: '1 - Registro ANS',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: settings.headerPadding
				},
				content: {
					text: _.has(data, 'cabecalhoConsulta.registroANS') ? data.cabecalhoConsulta.registroANS : createBlock('|__', 6),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
					padding: settings.contentPadding,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 36,
				y: 33,
				h: 12.5,
				w: 105,
				header: {
					text: '3 - Numero da Guia Atribuido Pela Operadora',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: settings.headerPadding,
				},
				content: {
					text: _.has(data, 'numeroGuiaOperadora') ? data.numeroGuiaOperadora : createBlock('|__', 20),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
					padding: settings.contentPadding,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin,
				y: 47,
				h: 4.5,
				w: 297 - 2 * settings.leftMargin,
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
						R: 255,
						G: 255,
						B: 255,
					}
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin,
				y: 53,
				h: 12.5,
				w: 105,
				header: {
					text: '4 - Numero da Carteira',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: settings.headerPadding
				},
				content: {
					text: _.has(data, 'dadosBeneficiario.numeroCarteira') ? data.dadosBeneficiario.numeroCarteira : createBlock(settings.blockDivisor, 20),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
					padding: settings.contentPadding,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 106,
				y: 53,
				h: 12.5,
				w: 52,
				header: {
					text: '5 - Validade da Carteira',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: settings.headerPadding,
				},
				content: {
					text: _.has(data, 'dadosBeneficiario.validadeCarteira') ? formatDate(data.dadosBeneficiario.validadeCarteira) : settings.dateBlock,
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
					padding: settings.contentPadding,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: 163,
				y: 53,
				h: 12.5,
				w: 35,
				header: {
					text: '6 - Atendimento RN',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: settings.headerPadding,
				},
				content: {
					text: _.has(data, 'dadosBeneficiario.atendimentoRN') ? data.dadosBeneficiario.atendimentoRN : createBlock(settings.blockDivisor, 1),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
					//padding: settings.contentPadding,
					align: 'center',
				}
			})
		})

	.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin,
				y: 67,
				h: 12.5,
				w: 211,
				header: {
					text: '7 - Nome',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: settings.headerPadding,
				},
				content: {
					text: _.has(data, 'dadosBeneficiario.nomeBeneficiario') ? data.dadosBeneficiario.nomeBeneficiario : "",
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
					padding: settings.contentPadding,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: 297 - settings.leftMargin - 79,
				y: 67,
				h: 12.5,
				w: 79,
				header: {
					text: '8 - Cartao Nacional de Saude',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: settings.headerPadding,
				},
				content: {
					text: _.has(data, 'dadosBeneficiario.numeroCNS') ? data.dadosBeneficiario.numeroCNS : createBlock(settings.blockDivisor, 15),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
					padding: settings.contentPadding,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin,
				y: 81,
				h: 4.5,
				w: 297 - 2 * settings.leftMargin,
				header: {
					text: 'Dados do Contratado',
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
						R: 255,
						G: 255,
						B: 255,
					}
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin,
				y: 87,
				h: 12.5,
				w: 74,
				header: {
					text: '9 - Codigo na Operadora',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: settings.headerPadding
				},
				content: {
					text: _.has(data, 'contratadoExecutante') ? findDadosIdentificacao(data.contratadoExecutante) : createBlock(settings.blockDivisor, 14),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
					padding: settings.contentPadding,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 75,
				y: 87,
				h: 12.5,
				w: 177,
				header: {
					text: '10 - Nome do Contratado',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: settings.headerPadding,
				},
				content: {
					text: _.has(data, 'dadosBeneficiario.nomeContratado') ? data.dadosBeneficiario.nomeContratado : "",
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
					padding: settings.contentPadding,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: 297 - settings.leftMargin - 38,
				y: 87,
				h: 12.5,
				w: 38,
				header: {
					text: '11 - CNES',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: settings.headerPadding,
				},
				content: {
					text: _.has(data, 'CNES') ? data.CNES : createBlock(settings.blockDivisor, 7),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
					padding: settings.contentPadding,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin,
				y: 101,
				h: 12.5,
				w: 144.5,
				header: {
					text: '12 - Nome do Profissional Executante',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: settings.headerPadding,
				},
				content: {
					text: _.has(data, 'profissionalExecutante.nomeProfissional') ? data.profissionalExecutante.nomeProfissional : "",
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
					padding: settings.contentPadding,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: 297 - settings.leftMargin - 33 - 14 - 75 - 23,
				y: 101,
				h: 12.5,
				w: 22,
				header: {
					text: ['13 - Conselho', 'Profissional'],
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: settings.headerPadding,
				},
				content: {
					text: _.has(data, 'profissionalExecutante.conselhoProfissional') ? data.profissionalExecutante.conselhoProfissional : createBlock(settings.blockDivisor, 2),
					fontSize: settings.headerFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
					padding: settings.contentPadding,
					align: 'center',
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: 297 - settings.leftMargin - 33 - 14 - 75,
				y: 101,
				h: 12.5,
				w: 74,
				header: {
					text: '14 - Numero no Conselho',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: settings.headerPadding,
				},
				content: {
					text: _.has(data, 'profissionalExecutante.numeroConselhoProfissional') ? data.profissionalExecutante.numeroConselhoProfissional : createBlock(settings.blockDivisor, 14),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
					padding: settings.contentPadding,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: 297 - settings.leftMargin - 33 - 14,
				y: 101,
				h: 12.5,
				w: 13,
				header: {
					text: '15 - UF',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: settings.headerPadding,
				},
				content: {
					text: _.has(data, 'profissionalExecutante.UF') ? data.profissionalExecutante.UF : createBlock(settings.blockDivisor, 2),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
					padding: settings.contentPadding,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: 297 - settings.leftMargin - 33,
				y: 101,
				h: 12.5,
				w: 33,
				header: {
					text: '16 - Codigo CBO',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: settings.headerPadding,
				},
				content: {
					text: _.has(data, 'profissionalExecutante.CBOS') ? data.profissionalExecutante.CBOS : createBlock(settings.blockDivisor, 6),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
					padding: settings.contentPadding,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin,
				y: 115,
				h: 4.5,
				w: 297 - 2 * settings.leftMargin,
				header: {
					text: 'Dados do Atendimento / Procedimento Realizado',
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
						R: 255,
						G: 255,
						B: 255,
					}
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin,
				y: 121,
				h: 12.5,
				w: 91,
				header: {
					text: '17 - Indicacao de Acidente (acidente ou doenca relacionada',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: settings.headerPadding,
				},
				content: {
					text: _.has(data, 'indicacaoAcidente') ? data.indicacaoAcidente : createBlock(settings.blockDivisor, 1),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
					padding: settings.contentPadding,
					align: 'center',
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin,
				y: 135,
				h: 12.5,
				w: 69,
				header: {
					text: '18 - Data do Atendimento',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: settings.headerPadding,
				},
				content: {
					text: _.has(data, 'dadosAtendimento.dataAtendimento') ? formatDate(data.dadosAtendimento.dataAtendimento) : settings.dateBlockLarge,
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
					padding: settings.contentPadding,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 70,
				y: 135,
				h: 12.5,
				w: 35,
				header: {
					text: '19 - Tipo de Consulta',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: settings.headerPadding,
				},
				content: {
					text: _.has(data, 'dadosAtendimento.tipoConsulta') ? data.dadosAtendimento.tipoConsulta : createBlock(settings.blockDivisor, 1),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
					padding: settings.contentPadding,
					align: 'center',
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 70 + 36,
				y: 135,
				h: 12.5,
				w: 23,
				header: {
					text: '20 - Tabela',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: settings.headerPadding,
				},
				content: {
					text: _.has(data, 'dadosAtendimento.procedimento.codigoTabela') ? data.dadosAtendimento.procedimento.codigoTabela : createBlock(settings.blockDivisor, 2),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
					padding: settings.contentPadding,
					align: 'center',
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 70 + 36 + 24,
				y: 135,
				h: 12.5,
				w: 54,
				header: {
					text: '21 - Codigo do Procedimento',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: settings.headerPadding,
				},
				content: {
					text: _.has(data, 'dadosAtendimento.procedimento.codigoProcedimento') ? data.dadosAtendimento.procedimento.codigoProcedimento : createBlock(settings.blockDivisor, 10),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
					padding: settings.contentPadding,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 70 + 36 + 24 + 55,
				y: 135,
				h: 12.5,
				w: 45,
				header: {
					text: '22 - Valor do Procedimento',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: settings.headerPadding,
				},
				content: {
					text: _.has(data, 'dadosAtendimento.valorProcedimento') ? data.dadosAtendimento.valorProcedimento : '|__|__|__|__|__|__|,|__|__|',
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
					padding: settings.contentPadding,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin,
				y: 149,
				h: 39,
				w: 297 - 2 * settings.leftMargin,
				header: {
					text: '23 - Observacao / Justificativa',
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
				}
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: _.has(data, 'observacao') ? data.observacao.match(/(.|[\r\n]){1,167}/g).slice(0,8) : "",
				x: settings.leftMargin + 1,
				y: 155,
				fontSize: settings.contentFontSize,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin,
				y: 190,
				h: 12.5,
				w: 145,
				header: {
					text: '24 - Assinatura do Profissional Executante',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: settings.headerPadding,
				},
				content: {
					text:  "",
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 146,
				y: 190,
				h: 12.5,
				w: 145,
				header: {
					text: '25 - Assinatura do Beneficiario ou Responsavel',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: settings.headerPadding,
				},
				content: {
					text:  "",
				}
			})
		})

	.then(actions.saveDoc)
		.then(input => {
			return Promise.resolve(input)
		})
}