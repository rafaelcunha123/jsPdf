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

function existsProcedimento(data, index, field) {
	if (_.has(data, 'procedimentosSolicitados') && data.procedimentosSolicitados[index]) {
		if (_.has(data.procedimentosSolicitados[index], field)) {
			return _.get(data.procedimentosSolicitados[index], field)
		} else false
	} else return false
}

function existsProcedimentoRealizado(data, index, field) {
	if (_.has(data, 'procedimentosRealizados') && data.procedimentosRealizados[index]) {
		if (_.has(data.procedimentosRealizados[index], field)) {
			return _.get(data.procedimentosRealizados[index], field)
		} else return false
	} else return false
}

function buildInterval(data, index) {
	if (data.procedimentosRealizados && data.procedimentosRealizados[index]) {
		if (data.procedimentosRealizados[index].horaInicial) {
			if(data.procedimentosRealizados[index].horaFinal){
				return data.procedimentosRealizados[index].horaInicial.slice(0,5) + '          a          ' + data.procedimentosRealizados[index].horaFinal.slice(0,5)
			} else {
				return data.procedimentosRealizados[index].horaInicial  + '      a |___|___|:|___|___|'
			}
		} else if (data.procedimentosRealizados[index].horaFinal) {
				return '|___|___|:|___|___| a       ' + data.procedimentosRealizados[index].horaFinal
		} else return '|___|___|:|___|___| a |___|___|:|___|___|'
	}
	return '|___|___|:|___|___| a |___|___|:|___|___|'
}



exports.spsadt = function(validData) {


	const data = _.has(validData, 'guiaSPSADT') ? validData.guiaSPSADT : {}

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
		intervalBlock: '|__|__|:|__|__| a |__|__|:|__|__|',
		leftMargin: 3
	}

	return actions.text(doc, {
			txtArray: ['GUIA  DE SERVICO PROFISSIONAL / SERVICO AUXILIAR DE', 'DIAGNOSTICO E TERAPIA - SP/SADT'],
			align: 'center',
			fontSize: 11,
			fontFamily: 'times',
			fontStyle: 'bold',
			y: 2,
			lineSpacing: 0.01,
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
				txtArray: _.has(data, 'cabecalhoGuia.numeroGuiaPrestador') ? data.cabecalhoGuia.numeroGuiaPrestador : "",
				x: 251,
				y: 4,
				fontSize: 12,
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin,
				y: 15,
				h: 7.28,
				w: 26,
				header: {
					text: '1 - Registro ANS',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
				},
				content: {
					text: _.has(data, 'cabecalhoGuia.registroANS') ? data.cabecalhoGuia.registroANS : createBlock('|__', 6),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 27,
				y: 15,
				h: 7.28,
				w: 78,
				header: {
					text: '3 - Numero da Guia Principal',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
				},
				content: {
					text: _.has(data, 'cabecalhoGuia.guiaPrincipal') ? data.cabecalhoGuia.guiaPrincipal : createBlock('|__', 20),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin,
				y: 23,
				h: 7.28,
				w: 39,
				header: {
					text: '4 - Data da Autorizacao',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
				},
				content: {
					text: _.has(data, 'dadosAutorizacao.dataAutorizacao') ? formatDate(data.dadosAutorizacao.dataAutorizacao) : settings.dateBlock,
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 40,
				y: 23,
				h: 7.28,
				w: 80,
				header: {
					text: '5 - Senha',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
				},
				content: {
					text: _.has(data, 'dadosAutorizacao.senha') ? data.dadosAutorizacao.senha : createBlock(settings.blockDivisor, 20),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 122,
				y: 23,
				h: 7.28,
				w: 39,
				header: {
					text: '6 - Validade da Senha',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
				},
				content: {
					text: _.has(data, 'dadosAutorizacao.dataValidadeSenha') ? formatDate(data.dadosAutorizacao.dataValidadeSenha) : settings.dateBlock,
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 163,
				y: 23,
				h: 7.28,
				w: 78,
				header: {
					text: '7 - Numero da Guia Atribuido pela Operadora',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
				},
				content: {
					text: _.has(data, 'dadosAutorizacao.numeroGuiaOperadora') ? data.dadosAutorizacao.numeroGuiaOperadora : createBlock(settings.blockDivisor, 20),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin,
				y: 31,
				h: 3,
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
				y: 34.5,
				h: 7.28,
				w: 78,
				header: {
					text: '8 - Numero da Carteira',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
				},
				content: {
					text: _.has(data, 'dadosBeneficiario.numeroCarteira') ? data.dadosBeneficiario.numeroCarteira : createBlock(settings.blockDivisor, 20),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 79,
				y: 34.5,
				h: 7.28,
				w: 39,
				header: {
					text: '9 - Validade da Carteira',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
				},
				content: {
					text: _.has(data, 'dadosBeneficiario.validadeCarteira') ? formatDate(data.dadosBeneficiario.validadeCarteira) : settings.dateBlock,
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 119,
				y: 34.5,
				h: 7.28,
				w: 88,
				header: {
					text: '10 - Nome',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
				},
				content: {
					text: _.has(data, 'dadosBeneficiario.nomeBeneficiario') ? data.dadosBeneficiario.nomeBeneficiario : "",
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 119 + 88 + 1.5,
				y: 34.5,
				h: 7.28,
				w: 60,
				header: {
					text: '11 - Cartao Nacional de Saude',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
				},
				content: {
					text: _.has(data, 'dadosBeneficiario.numeroCNS') ? data.dadosBeneficiario.numeroCNS : createBlock(settings.blockDivisor, 15),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: 297 - settings.leftMargin - 21.33,
				y: 34.5,
				h: 7.28,
				w: 21.33,
				header: {
					text: '12 - Atendimento RN',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
				},
				content: {
					text: _.has(data, 'dadosBeneficiario.atendimentoRN') ? "  	" + data.dadosBeneficiario.atendimentoRN : "  	" + createBlock(settings.blockDivisor, 1),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin,
				y: 42.5,
				h: 3,
				w: 297 - 2 * settings.leftMargin,
				header: {
					text: 'Dados do Solicitante',
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
				y: 46,
				h: 7.28,
				w: 56,
				header: {
					text: '13 - Codigo na Operadora',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
				},
				content: {
					text: _.has(data, 'dadosSolicitante.contratadoSolicitante') ? (findDadosIdentificacao(data.dadosSolicitante.contratadoSolicitante) ? findDadosIdentificacao(data.dadosSolicitante.contratadoSolicitante) : createBlock(settings.blockDivisor, 14)) : createBlock(settings.blockDivisor, 14),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 57,
				y: 46,
				h: 7.28,
				w: 297 - 2 * settings.leftMargin - 57,
				header: {
					text: '14 - Nome do Contratado',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
				},
				content: {
					text: _.has(data, 'dadosSolicitante.contratadoSolicitante.nomeContratado') ? data.dadosSolicitante.contratadoSolicitante.nomeContratado : "",
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin,
				y: 54,
				h: 7.28,
				w: 84.78,
				header: {
					text: '15 - Nome do Profissional Solicitante',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
				},
				content: {
					text: _.has(data, 'dadosSolicitante.profissionalSolicitante.nomeProfissional') ? data.dadosSolicitante.profissionalSolicitante.nomeProfissional : "",
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 85.78,
				y: 54,
				h: 7.28,
				w: 14,
				content: {
					text: _.has(data, 'dadosSolicitante.profissionalSolicitante.conselhoProfissional') ? '       ' + data.dadosSolicitante.profissionalSolicitante.conselhoProfissional : '    ' + createBlock('|___', 2),
					fontSize: settings.headerFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.headerFont,
				}
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: ['16 - Conselho', 'Profissional'],
				x: settings.leftMargin + 86.5,
				y: 54,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
				lineSpacing: 0.01,
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 100.78,
				y: 54,
				h: 7.28,
				w: 59.5,
				header: {
					text: '17 - Numero do Conselho',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
				},
				content: {
					text: _.has(data, 'dadosSolicitante.profissionalSolicitante.numeroConselhoProfissional') ? data.dadosSolicitante.profissionalSolicitante.numeroConselhoProfissional : createBlock(settings.blockDivisor, 15),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 161.28,
				y: 54,
				h: 7.28,
				w: 9.6,
				header: {
					text: '18 - UF',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
				},
				content: {
					text: _.has(data, 'dadosSolicitante.profissionalSolicitante.UF') ? data.dadosSolicitante.profissionalSolicitante.UF : createBlock(settings.blockDivisor, 2),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 171.88,
				y: 54,
				h: 7.28,
				w: 24.8,
				header: {
					text: '19 - Codigo CBO',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
				},
				content: {
					text: _.has(data, 'dadosSolicitante.profissionalSolicitante.CBOS') ? data.dadosSolicitante.profissionalSolicitante.CBOS : createBlock(settings.blockDivisor, 6),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 197.68,
				y: 54,
				h: 7.28,
				w: 297 - 2 * settings.leftMargin - 197.68,
				header: {
					text: '20 - Assinatura do Profissional Solicictante',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
				},
				content: {
					text: '',
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin,
				y: 62,
				h: 3,
				w: 297 - 2 * settings.leftMargin,
				header: {
					text: 'Dados da Solicitacao / Procedimentos ou Itens Assistenciais Solicitados',
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
				y: 65.5,
				h: 7.28,
				w: 14.5,
				content: {
					text: _.has(data, 'dadosSolicitacao.caraterAtendimento') ? '        ' + data.dadosSolicitacao.caraterAtendimento : '        ' + createBlock('|___', 1),
					fontSize: settings.headerFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: ['21 - Carater do', 'Atendimento'],
				x: settings.leftMargin + 0.3,
				y: 65.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
				lineSpacing: 0.01,
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 15.5,
				y: 65.5,
				h: 7.28,
				w: 39,
				header: {
					text: '22 - Data da Solicitacao',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
				},
				content: {
					text: _.has(data, 'dadosSolicitacao.dataSolicitacao') ? formatDate(data.dadosSolicitacao.dataSolicitacao) : settings.dateBlock,
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 55.5,
				y: 65.5,
				h: 7.28,
				w: 297 - 2 * settings.leftMargin - 55.5,
				header: {
					text: '23 - Indicacao Clinica',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
				},
				content: {
					text: _.has(data, 'dadosSolicitacao.indicacaoClinica') ? data.dadosSolicitacao.indicacaoClinica.slice(0, 178) : '',
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin,
				y: 73.5,
				h: 22.5,
				w: 291,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: ['24 - Tabela'],
				x: settings.leftMargin + 0.5,
				y: 73,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: ['25 - Codigo do Procedimento', 'ou Item Assistencial'],
				x: settings.leftMargin + 13,
				y: 73.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
				lineSpacing: 0.01,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: ['26 - Descricao'],
				x: settings.leftMargin + 53,
				y: 73.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
				lineSpacing: 0.01,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: ['27 - Qtde. Solic.'],
				x: settings.leftMargin + 256,
				y: 73.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
				lineSpacing: 0.01,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: ['28 - Qtde. Aut.'],
				x: settings.leftMargin + 274,
				y: 73.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
				lineSpacing: 0.01,
			})
		})

	.then(input => {
			return actions.text(input.doc, {
				txtArray: '1 - ' + (existsProcedimento(data, 0, 'procedimento.codigoTabela') ? existsProcedimento(data, 0, 'procedimento.codigoTabela') : createBlock('|___', 2)),
				x: settings.leftMargin + 0.5,
				y: 78.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimento(data, 0, 'procedimento.codigoProcedimento') ? existsProcedimento(data, 0, 'procedimento.codigoProcedimento') : createBlock('|___', 10),
				x: settings.leftMargin + 13,
				y: 78.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimento(data, 0, 'procedimento.descricaoProcedimento') ? existsProcedimento(data, 0, 'procedimento.descricaoProcedimento') : '_____________________________________________________________________________________________________________________________________________________________________________________',
				x: settings.leftMargin + 53,
				y: 78.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimento(data, 0, 'quantidadeSolicitada') ? ("       00" + existsProcedimento(data, 0, 'quantidadeSolicitada')).slice(-3) : createBlock('|___', 3),
				x: settings.leftMargin + 257,
				y: 78.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimento(data, 0, 'quantidadeAutorizada') ? ("       00" + existsProcedimento(data, 0, 'quantidadeAutorizada')).slice(-3) : createBlock('|___', 3),
				x: settings.leftMargin + 275,
				y: 78.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})

	.then(input => {
			return actions.text(input.doc, {
				txtArray: '2 - ' + (existsProcedimento(data, 1, 'procedimento.codigoTabela') ? existsProcedimento(data, 1, 'procedimento.codigoTabela') : createBlock('|___', 2)),
				x: settings.leftMargin + 0.5,
				y: 82.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimento(data, 1, 'procedimento.codigoProcedimento') ? existsProcedimento(data, 1, 'procedimento.codigoProcedimento') : createBlock('|___', 10),
				x: settings.leftMargin + 13,
				y: 82.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimento(data, 1, 'procedimento.descricaoProcedimento') ? existsProcedimento(data, 1, 'procedimento.descricaoProcedimento') : '_____________________________________________________________________________________________________________________________________________________________________________________',
				x: settings.leftMargin + 53,
				y: 82.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimento(data, 1, 'quantidadeSolicitada') ? ("       00" + existsProcedimento(data, 1, 'quantidadeSolicitada')).slice(-3) : createBlock('|___', 3),
				x: settings.leftMargin + 257,
				y: 82.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimento(data, 1, 'quantidadeAutorizada') ? ("       00" + existsProcedimento(data, 1, 'quantidadeAutorizada')).slice(-3) : createBlock('|___', 3),
				x: settings.leftMargin + 275,
				y: 82.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})


	.then(input => {
			return actions.text(input.doc, {
				txtArray: '3 - ' + (existsProcedimento(data, 2, 'procedimento.codigoTabela') ? existsProcedimento(data, 2, 'procedimento.codigoTabela') : createBlock('|___', 2)),
				x: settings.leftMargin + 0.5,
				y: 86,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimento(data, 2, 'procedimento.codigoProcedimento') ? existsProcedimento(data, 2, 'procedimento.codigoProcedimento') : createBlock('|___', 10),
				x: settings.leftMargin + 13,
				y: 86,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimento(data, 2, 'procedimento.descricaoProcedimento') ? existsProcedimento(data, 2, 'procedimento.descricaoProcedimento') : '_____________________________________________________________________________________________________________________________________________________________________________________',
				x: settings.leftMargin + 53,
				y: 86,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimento(data, 2, 'quantidadeSolicitada') ? ("       00" + existsProcedimento(data, 2, 'quantidadeSolicitada')).slice(-3) : createBlock('|___', 3),
				x: settings.leftMargin + 257,
				y: 86,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimento(data, 2, 'quantidadeAutorizada') ? ("       00" + existsProcedimento(data, 2, 'quantidadeAutorizada')).slice(-3) : createBlock('|___', 3),
				x: settings.leftMargin + 275,
				y: 86,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})


	.then(input => {
			return actions.text(input.doc, {
				txtArray: '4 - ' + (existsProcedimento(data, 3, 'procedimento.codigoTabela') ? existsProcedimento(data, 3, 'procedimento.codigoTabela') : createBlock('|___', 2)),
				x: settings.leftMargin + 0.5,
				y: 89.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimento(data, 3, 'procedimento.codigoProcedimento') ? existsProcedimento(data, 3, 'procedimento.codigoProcedimento') : createBlock('|___', 10),
				x: settings.leftMargin + 13,
				y: 89.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimento(data, 3, 'procedimento.descricaoProcedimento') ? existsProcedimento(data, 3, 'procedimento.descricaoProcedimento') : '_____________________________________________________________________________________________________________________________________________________________________________________',
				x: settings.leftMargin + 53,
				y: 89.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimento(data, 3, 'quantidadeSolicitada') ? ("       00" + existsProcedimento(data, 3, 'quantidadeSolicitada')).slice(-3) : createBlock('|___', 3),
				x: settings.leftMargin + 257,
				y: 89.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimento(data, 3, 'quantidadeAutorizada') ? ("       00" + existsProcedimento(data, 3, 'quantidadeAutorizada')).slice(-3) : createBlock('|___', 3),
				x: settings.leftMargin + 275,
				y: 89.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})

	.then(input => {
			return actions.text(input.doc, {
				txtArray: '5 - ' + (existsProcedimento(data, 4, 'procedimento.codigoTabela') ? existsProcedimento(data, 4, 'procedimento.codigoTabela') : createBlock('|___', 2)),
				x: settings.leftMargin + 0.5,
				y: 93,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimento(data, 4, 'procedimento.codigoProcedimento') ? existsProcedimento(data, 4, 'procedimento.codigoProcedimento') : createBlock('|___', 10),
				x: settings.leftMargin + 13,
				y: 93,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimento(data, 4, 'procedimento.descricaoProcedimento') ? existsProcedimento(data, 4, 'procedimento.descricaoProcedimento') : '_____________________________________________________________________________________________________________________________________________________________________________________',
				x: settings.leftMargin + 53,
				y: 93,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimento(data, 4, 'quantidadeSolicitada') ? ("       00" + existsProcedimento(data, 4, 'quantidadeSolicitada')).slice(-3) : createBlock('|___', 3),
				x: settings.leftMargin + 257,
				y: 93,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimento(data, 3, 'quantidadeAutorizada') ? ("       00" + existsProcedimento(data, 3, 'quantidadeAutorizada')).slice(-3) : createBlock('|___', 3),
				x: settings.leftMargin + 275,
				y: 93,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})

	.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin,
				y: 96.5,
				h: 3,
				w: 297 - 2 * settings.leftMargin,
				header: {
					text: 'Dados do Contratado Executante',
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
				y: 100,
				h: 7.28,
				w: 56,
				header: {
					text: '29 - Codigo na Operadora',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
				},
				content: {
					text: _.has(data, 'dadosExecutante.contratadoExecutante') ? findDadosIdentificacao(data.dadosExecutante.contratadoExecutante) : createBlock(settings.blockDivisor, 14),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 57,
				y: 100,
				h: 7.28,
				w: 297 - 2 * settings.leftMargin - 33.45 - 58,
				header: {
					text: '30 - Nome do Contratado',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
				},
				content: {
					text: _.has(data, 'dadosExecutante.contratadoExecutante.nomeContratado') ? data.dadosExecutante.contratadoExecutante.nomeContratado : "",
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 257.55,
				y: 100,
				h: 7.28,
				w: 33.45,
				header: {
					text: '31 - Codigo CNES',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
				},
				content: {
					text: _.has(data, 'dadosExecutante.CNES') ? data.dadosExecutante.CNES : createBlock(settings.blockDivisor, 7),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin,
				y: 108,
				h: 3,
				w: 297 - 2 * settings.leftMargin,
				header: {
					text: 'Dados do Atendimento',
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
				y: 111.5,
				h: 7.28,
				w: 24.72,
				header: {
					text: '32 - Tipo de Atendimento',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
				},
				content: {
					text: _.has(data, 'dadosAtendimento.tipoAtendimento') ? data.dadosAtendimento.tipoAtendimento.toString() : '         ' + createBlock(settings.blockDivisor, 2),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 25.72,
				y: 111.5,
				h: 7.28,
				w: 55.35,
				header: {
					text: '33 - Indicacao de Acidente (acidente ou doenca relacionada)',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
				},
				content: {
					text: _.has(data, 'dadosAtendimento.indicacaoAcidente') ? data.dadosAtendimento.indicacaoAcidente.toString() : '                             ' + createBlock(settings.blockDivisor, 1),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 25.72 + 56.35,
				y: 111.5,
				h: 7.28,
				w: 24.72,
				header: {
					text: '34 - Tipo de Consulta',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
				},
				content: {
					text: _.has(data, 'dadosAtendimento.tipoConsulta') ? data.dadosAtendimento.tipoConsulta.toString() : '           ' + createBlock(settings.blockDivisor, 1),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 25.72 + 56.35 + 25.72,
				y: 111.5,
				h: 7.28,
				w: 43.33,
				header: {
					text: '35 - Motivo de Encerramento do Atendimento',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
				},
				content: {
					text: _.has(data, 'dadosAtendimento.motivoEncerramento') ? '                       ' + data.dadosAtendimento.motivoEncerramento.toString() : '                       ' + createBlock(settings.blockDivisor, 1),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin,
				y: 119,
				h: 3,
				w: 297 - 2 * settings.leftMargin,
				header: {
					text: 'Dados da Execucao / Procedimentos e Exames Realizados',
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
				y: 122.5,
				h: 20.39,
				w: 291,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: ['36 - Data'],
				x: settings.leftMargin + 0.5,
				y: 122.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: ['37-Hora Inicial'],
				x: settings.leftMargin + 36.5,
				y: 122.5,
				fontSize: 5.7,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
				lineSpacing: 0.01,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: ['38-Hora Final'],
				x: settings.leftMargin + 51,
				y: 122.5,
				fontSize: 5.7,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
				lineSpacing: 0.01,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: ['39-Tabela'],
				x: settings.leftMargin + 64.5,
				y: 122.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
				lineSpacing: 0.01,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: ['40 - Codigo do Procedimento'],
				x: settings.leftMargin + 75,
				y: 122.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
				lineSpacing: 0.01,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: ['41 - Descricao'],
				x: settings.leftMargin + 104,
				y: 122.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
				lineSpacing: 0.01,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: ['42-Qtde.'],
				x: settings.leftMargin + 172.5,
				y: 122.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
				lineSpacing: 0.01,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: ['43-Via'],
				x: settings.leftMargin + 185,
				y: 122.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
				lineSpacing: 0.01,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: ['44-Tec'],
				x: settings.leftMargin + 192,
				y: 122.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
				lineSpacing: 0.01,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: ['45-Fator Red./Acresc.'],
				x: settings.leftMargin + 199.5,
				y: 122.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
				lineSpacing: 0.01,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: ['46-Valor Unitario (R$)'],
				x: settings.leftMargin + 222,
				y: 122.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
				lineSpacing: 0.01,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: ['47-Valor Total (R$)'],
				x: settings.leftMargin + 256,
				y: 122.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
				lineSpacing: 0.01,
			})
		})


	.then(input => {
			return actions.text(input.doc, {
				txtArray: '1 - ' + (existsProcedimentoRealizado(data, 0, 'dataExecucao') ? existsProcedimentoRealizado(data, 0, 'dataExecucao') : '|___|___|/|___|___|/|___|___|___|___|'),
				x: settings.leftMargin + 0.5,
				y: 126,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: buildInterval(data, 0),
				x: settings.leftMargin + 37,
				y: 126,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 0, 'procedimento.codigoTabela') ? existsProcedimentoRealizado(data, 0, 'procedimento.codigoTabela') : createBlock('|___', 2),
				x: settings.leftMargin + 65,
				y: 126,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 0, 'procedimento.codigoProcedimento') ? existsProcedimentoRealizado(data, 0, 'procedimento.codigoProcedimento') : createBlock(settings.blockDivisor, 10),
				x: settings.leftMargin + 75,
				y: 126,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 0, 'procedimento.descricaoProcedimento') ? existsProcedimentoRealizado(data, 0, 'procedimento.descricaoProcedimento') : '_____________________________________________________________',
				x: settings.leftMargin + 104,
				y: 126,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 0, 'quantidadeExecutada') ? existsProcedimentoRealizado(data, 0, 'quantidadeExecutada') : createBlock('|___', 3),
				x: settings.leftMargin + 172.5,
				y: 126,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 0, 'viaAcesso') ? existsProcedimentoRealizado(data, 0, 'viaAcesso') : createBlock('|___', 1),
				x: settings.leftMargin + 186.5,
				y: 126,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 0, 'tecnicaUtilizada') ? existsProcedimentoRealizado(data, 0, 'tecnicaUtilizada') :  createBlock('|___', 1),
				x: settings.leftMargin + 193,
				y: 126,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 0, 'reducaoAcrescimo') ? existsProcedimentoRealizado(data, 0, 'reducaoAcrescimo') : '|___|,|___|___|',
				x: settings.leftMargin + 203,
				y: 126,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 0, 'valorUnitario') ? existsProcedimentoRealizado(data, 0, 'valorUnitario') : '|___|___|___|___|___|___|,|___|___|',
				x: settings.leftMargin + 222,
				y: 126,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 0, 'valorTotal') ? existsProcedimentoRealizado(data, 0, 'valorTotal') : '|___|___|___|___|___|___|,|___|___|',
				x: settings.leftMargin + 256,
				y: 126,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})



	.then(input => {
			return actions.text(input.doc, {
				txtArray: '2 - ' + (existsProcedimentoRealizado(data, 1, 'dataExecucao') ? existsProcedimentoRealizado(data, 1, 'dataExecucao') : '|___|___|/|___|___|/|___|___|___|___|'),
				x: settings.leftMargin + 0.5,
				y: 129.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: buildInterval(data, 1),
				x: settings.leftMargin + 37,
				y: 129.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 1, 'procedimento.codigoTabela') ? existsProcedimentoRealizado(data, 1, 'procedimento.codigoTabela') : createBlock('|___', 2),
				x: settings.leftMargin + 65,
				y: 129.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 1, 'procedimento.codigoProcedimento') ? existsProcedimentoRealizado(data, 1, 'procedimento.codigoProcedimento') : createBlock(settings.blockDivisor, 10),
				x: settings.leftMargin + 75,
				y: 129.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 1, 'procedimento.descricaoProcedimento') ? existsProcedimentoRealizado(data, 1, 'procedimento.descricaoProcedimento') : '_____________________________________________________________',
				x: settings.leftMargin + 104,
				y: 129.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 1, 'quantidadeExecutada') ? existsProcedimentoRealizado(data, 1, 'quantidadeExecutada') : createBlock('|___', 3),
				x: settings.leftMargin + 172.5,
				y: 129.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 1, 'viaAcesso') ? existsProcedimentoRealizado(data, 1, 'viaAcesso') : createBlock('|___', 1),
				x: settings.leftMargin + 186.5,
				y: 129.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 1, 'tecnicaUtilizada') ? existsProcedimentoRealizado(data, 1, 'tecnicaUtilizada') :  createBlock('|___', 1),
				x: settings.leftMargin + 193,
				y: 129.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 1, 'reducaoAcrescimo') ? existsProcedimentoRealizado(data, 1, 'reducaoAcrescimo') : '|___|,|___|___|',
				x: settings.leftMargin + 203,
				y: 129.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 1, 'valorUnitario') ? existsProcedimentoRealizado(data, 1, 'valorUnitario') : '|___|___|___|___|___|___|,|___|___|',
				x: settings.leftMargin + 222,
				y: 129.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 1, 'valorTotal') ? existsProcedimentoRealizado(data, 1, 'valorTotal') : '|___|___|___|___|___|___|,|___|___|',
				x: settings.leftMargin + 256,
				y: 129.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})


	.then(input => {
			return actions.text(input.doc, {
				txtArray: '3 - ' + (existsProcedimentoRealizado(data, 2, 'dataExecucao') ? existsProcedimentoRealizado(data, 2, 'dataExecucao') : '|___|___|/|___|___|/|___|___|___|___|'),
				x: settings.leftMargin + 0.5,
				y: 133,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: buildInterval(data, 2),
				x: settings.leftMargin + 37,
				y: 133,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 2, 'procedimento.codigoTabela') ? existsProcedimentoRealizado(data, 2, 'procedimento.codigoTabela') : createBlock('|___', 2),
				x: settings.leftMargin + 65,
				y: 133,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 2, 'procedimento.codigoProcedimento') ? existsProcedimentoRealizado(data, 2, 'procedimento.codigoProcedimento') : createBlock(settings.blockDivisor, 10),
				x: settings.leftMargin + 75,
				y: 133,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 2, 'procedimento.descricaoProcedimento') ? existsProcedimentoRealizado(data, 2, 'procedimento.descricaoProcedimento') : '_____________________________________________________________',
				x: settings.leftMargin + 104,
				y: 133,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 2, 'quantidadeExecutada') ? existsProcedimentoRealizado(data, 2, 'quantidadeExecutada') : createBlock('|___', 3),
				x: settings.leftMargin + 172.5,
				y: 133,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 2, 'viaAcesso') ? existsProcedimentoRealizado(data, 2, 'viaAcesso') : createBlock('|___', 1),
				x: settings.leftMargin + 186.5,
				y: 133,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 2, 'tecnicaUtilizada') ? existsProcedimentoRealizado(data, 2, 'tecnicaUtilizada') :  createBlock('|___', 1),
				x: settings.leftMargin + 193,
				y: 133,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 2, 'reducaoAcrescimo') ? existsProcedimentoRealizado(data, 2, 'reducaoAcrescimo') : '|___|,|___|___|',
				x: settings.leftMargin + 203,
				y: 133,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 2, 'valorUnitario') ? existsProcedimentoRealizado(data, 2, 'valorUnitario') : '|___|___|___|___|___|___|,|___|___|',
				x: settings.leftMargin + 222,
				y: 133,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 2, 'valorTotal') ? existsProcedimentoRealizado(data, 2, 'valorTotal') : '|___|___|___|___|___|___|,|___|___|',
				x: settings.leftMargin + 256,
				y: 133,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})

	.then(input => {
			return actions.text(input.doc, {
				txtArray: '4 - '  + (existsProcedimentoRealizado(data, 3, 'dataExecucao') ? existsProcedimentoRealizado(data, 3, 'dataExecucao') : '|___|___|/|___|___|/|___|___|___|___|'),
				x: settings.leftMargin + 0.5,
				y: 136.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: buildInterval(data, 3) ,
				x: settings.leftMargin + 37,
				y: 136.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 3, 'procedimento.codigoTabela') ? existsProcedimentoRealizado(data, 3, 'procedimento.codigoTabela') : createBlock('|___', 2),
				x: settings.leftMargin + 65,
				y: 136.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 3, 'procedimento.codigoProcedimento') ? existsProcedimentoRealizado(data, 3, 'procedimento.codigoProcedimento') : createBlock(settings.blockDivisor, 10),
				x: settings.leftMargin + 75,
				y: 136.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 3, 'procedimento.descricaoProcedimento') ? existsProcedimentoRealizado(data, 3, 'procedimento.descricaoProcedimento') : '_____________________________________________________________',
				x: settings.leftMargin + 104,
				y: 136.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 3, 'quantidadeExecutada') ? existsProcedimentoRealizado(data, 3, 'quantidadeExecutada') : createBlock('|___', 3),
				x: settings.leftMargin + 172.5,
				y: 136.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 3, 'viaAcesso') ? existsProcedimentoRealizado(data, 3, 'viaAcesso') : createBlock('|___', 1),
				x: settings.leftMargin + 186.5,
				y: 136.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 3, 'tecnicaUtilizada') ? existsProcedimentoRealizado(data, 3, 'tecnicaUtilizada') :  createBlock('|___', 1),
				x: settings.leftMargin + 193,
				y: 136.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 3, 'reducaoAcrescimo') ? existsProcedimentoRealizado(data, 3, 'reducaoAcrescimo') : '|___|,|___|___|',
				x: settings.leftMargin + 203,
				y: 136.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 3, 'valorUnitario') ? existsProcedimentoRealizado(data, 3, 'valorUnitario') : '|___|___|___|___|___|___|,|___|___|',
				x: settings.leftMargin + 222,
				y: 136.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 3, 'valorTotal') ? existsProcedimentoRealizado(data, 3, 'valorTotal') : '|___|___|___|___|___|___|,|___|___|',
				x: settings.leftMargin + 256,
				y: 136.5,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})


	.then(input => {
			return actions.text(input.doc, {
				txtArray: '5 - '+ (existsProcedimentoRealizado(data, 4, 'dataExecucao') ? existsProcedimentoRealizado(data, 4, 'dataExecucao') : '|___|___|/|___|___|/|___|___|___|___|'),
				x: settings.leftMargin + 0.5,
				y: 140,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: buildInterval(data,4),
				x: settings.leftMargin + 37,
				y: 140,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 4, 'procedimento.codigoTabela') ? existsProcedimentoRealizado(data, 4, 'procedimento.codigoTabela') : createBlock('|___', 2),
				x: settings.leftMargin + 65,
				y: 140,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 4, 'procedimento.codigoProcedimento') ? existsProcedimentoRealizado(data, 4, 'procedimento.codigoProcedimento') : createBlock(settings.blockDivisor, 10),
				x: settings.leftMargin + 75,
				y: 140,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 4, 'procedimento.descricaoProcedimento') ? existsProcedimentoRealizado(data, 4, 'procedimento.descricaoProcedimento') : '_____________________________________________________________',
				x: settings.leftMargin + 104,
				y: 140,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 4, 'quantidadeExecutada') ? existsProcedimentoRealizado(data, 4, 'quantidadeExecutada') : createBlock('|___', 3),
				x: settings.leftMargin + 172.5,
				y: 140,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 4, 'viaAcesso') ? existsProcedimentoRealizado(data, 4, 'viaAcesso') : createBlock('|___', 1),
				x: settings.leftMargin + 186.5,
				y: 140,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 4, 'tecnicaUtilizada') ? existsProcedimentoRealizado(data, 4, 'tecnicaUtilizada') :  createBlock('|___', 1),
				x: settings.leftMargin + 193,
				y: 140,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 4, 'reducaoAcrescimo') ? existsProcedimentoRealizado(data, 4, 'reducaoAcrescimo') : '|___|,|___|___|',
				x: settings.leftMargin + 203,
				y: 140,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 4, 'valorUnitario') ? existsProcedimentoRealizado(data, 4, 'valorUnitario') : '|___|___|___|___|___|___|,|___|___|',
				x: settings.leftMargin + 222,
				y: 140,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: existsProcedimentoRealizado(data, 4, 'valorTotal') ? existsProcedimentoRealizado(data, 4, 'valorTotal') : '|___|___|___|___|___|___|,|___|___|',
				x: settings.leftMargin + 256,
				y: 140,
				fontSize: 6.3,
				fontStyle: settings.contentFontStyle,
				fontFamily: settings.contentFont,
			})
		})

	.then(input => {
		//TODO: IMPLEMENTAR INPUT DE PROFISSIONAIS EXECUTANTES. APENAS RELEVANTE PARA PROCEDIMENTOS COMPLEXOS
		return actions.formBox(input.doc, {
			x: settings.leftMargin,
			y: 143.5,
			h: 3,
			w: 297 - 2 * settings.leftMargin,
			header: {
				text: 'Identificacao do(s) Profissional(is) Executante(s)',
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
				y: 147,
				h: 20.5,
				w: 291,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: ['48-Seq.Ref.'],
				x: settings.leftMargin + 0.5,
				y: 147.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: ['49-Grau Part.'],
				x: settings.leftMargin + 12,
				y: 147.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: ['50-Codigo na Operadora/CPF'],
				x: settings.leftMargin + 26,
				y: 147.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: ['51-Nome do Profissional'],
				x: settings.leftMargin + 81,
				y: 147.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: ['52-Conselho', 'Profissional'],
				x: settings.leftMargin + 185,
				y: 147.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
				lineSpacing: 0.01,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: ['53-Numero no Conselho'],
				x: settings.leftMargin + 198,
				y: 147.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: ['54-UF'],
				x: settings.leftMargin + 256,
				y: 147.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: ['55-Codigo CBO'],
				x: settings.leftMargin + 265,
				y: 147.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})

	.then(input => {
			return actions.text(input.doc, {
				txtArray: createBlock('|___', 2),
				x: settings.leftMargin + 0.5,
				y: 153,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: createBlock('|___', 2),
				x: settings.leftMargin + 13,
				y: 153,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: createBlock('|___', 14),
				x: settings.leftMargin + 26,
				y: 153,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: '_____________________________________________________________________________________________',
				x: settings.leftMargin + 81,
				y: 153,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: createBlock('|___', 2),
				x: settings.leftMargin + 187,
				y: 153,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: createBlock('|___', 15),
				x: settings.leftMargin + 198,
				y: 153,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: createBlock('|___', 2),
				x: settings.leftMargin + 256,
				y: 153,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: createBlock('|___', 6),
				x: settings.leftMargin + 265,
				y: 153,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})


	.then(input => {
			return actions.text(input.doc, {
				txtArray: createBlock('|___', 2),
				x: settings.leftMargin + 0.5,
				y: 156.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: createBlock('|___', 2),
				x: settings.leftMargin + 13,
				y: 156.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: createBlock('|___', 14),
				x: settings.leftMargin + 26,
				y: 156.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: '_____________________________________________________________________________________________',
				x: settings.leftMargin + 81,
				y: 156.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: createBlock('|___', 2),
				x: settings.leftMargin + 187,
				y: 156.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: createBlock('|___', 15),
				x: settings.leftMargin + 198,
				y: 156.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: createBlock('|___', 2),
				x: settings.leftMargin + 256,
				y: 156.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: createBlock('|___', 6),
				x: settings.leftMargin + 265,
				y: 156.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})



	.then(input => {
			return actions.text(input.doc, {
				txtArray: createBlock('|___', 2),
				x: settings.leftMargin + 0.5,
				y: 160,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: createBlock('|___', 2),
				x: settings.leftMargin + 13,
				y: 160,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: createBlock('|___', 14),
				x: settings.leftMargin + 26,
				y: 160,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: '_____________________________________________________________________________________________',
				x: settings.leftMargin + 81,
				y: 160,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: createBlock('|___', 2),
				x: settings.leftMargin + 187,
				y: 160,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: createBlock('|___', 15),
				x: settings.leftMargin + 198,
				y: 160,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: createBlock('|___', 2),
				x: settings.leftMargin + 256,
				y: 160,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: createBlock('|___', 6),
				x: settings.leftMargin + 265,
				y: 160,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})

	.then(input => {
			return actions.text(input.doc, {
				txtArray: createBlock('|___', 2),
				x: settings.leftMargin + 0.5,
				y: 163.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: createBlock('|___', 2),
				x: settings.leftMargin + 13,
				y: 163.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: createBlock('|___', 14),
				x: settings.leftMargin + 26,
				y: 163.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: '_____________________________________________________________________________________________',
				x: settings.leftMargin + 81,
				y: 163.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: createBlock('|___', 2),
				x: settings.leftMargin + 187,
				y: 163.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: createBlock('|___', 15),
				x: settings.leftMargin + 198,
				y: 163.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: createBlock('|___', 2),
				x: settings.leftMargin + 256,
				y: 163.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: createBlock('|___', 6),
				x: settings.leftMargin + 265,
				y: 163.5,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})



	.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin,
				y: 168,
				h: 10,
				w: 291,
			})
		})
		.then(input => {
			// TODO: IMPLEMENTAR INPUT DE PROCEDIMENTOS EM SERIE
			return actions.text(input.doc, {
				txtArray: ['56-Data de Realizacao de Procedimentos em Serie'],
				x: settings.leftMargin + 0.5,
				y: 168,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: ['57-Assinatura do Beneficiario ou Responsavel'],
				x: settings.leftMargin + 48,
				y: 168,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: '1 - ' + '|___|___|/|___|___|/|___|___|___|___|',
				x: settings.leftMargin + 0.5,
				y: 171,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: '_________________',
				x: settings.leftMargin + 36.5,
				y: 171,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: '3 - ' + '|___|___|/|___|___|/|___|___|___|___|',
				x: settings.leftMargin + 58,
				y: 171,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: '_________________',
				x: settings.leftMargin + 58 + 36.5,
				y: 171,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: '5 - ' + '|___|___|/|___|___|/|___|___|___|___|',
				x: settings.leftMargin + 2 * 58,
				y: 171,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: '_________________',
				x: settings.leftMargin + 36.5 + 2 * 58,
				y: 171,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: '7 - ' + '|___|___|/|___|___|/|___|___|___|___|',
				x: settings.leftMargin + 3 * 58,
				y: 171,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: '_________________',
				x: settings.leftMargin + 36.5 + 3 * 58,
				y: 171,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: '9 - ' + '|___|___|/|___|___|/|___|___|___|___|',
				x: settings.leftMargin + 4 * 58,
				y: 171,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: '_________________',
				x: settings.leftMargin + 36.5 + 4 * 58,
				y: 171,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})



	.then(input => {
			return actions.text(input.doc, {
				txtArray: '2 - ' + '|___|___|/|___|___|/|___|___|___|___|',
				x: settings.leftMargin + 0.5,
				y: 175,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: '_________________',
				x: settings.leftMargin + 36.5,
				y: 175,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: '4 - ' + '|___|___|/|___|___|/|___|___|___|___|',
				x: settings.leftMargin + 58,
				y: 175,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: '_________________',
				x: settings.leftMargin + 58 + 36.5,
				y: 175,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: '6 - ' + '|___|___|/|___|___|/|___|___|___|___|',
				x: settings.leftMargin + 2 * 58,
				y: 175,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: '_________________',
				x: settings.leftMargin + 36.5 + 2 * 58,
				y: 175,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: '8 - ' + '|___|___|/|___|___|/|___|___|___|___|',
				x: settings.leftMargin + 3 * 58,
				y: 175,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: '_________________',
				x: settings.leftMargin + 36.5 + 3 * 58,
				y: 175,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: '10 - ' + '|___|___|/|___|___|/|___|___|___|___|',
				x: settings.leftMargin + 4 * 58,
				y: 175,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})
		.then(input => {
			return actions.text(input.doc, {
				txtArray: '_________________',
				x: settings.leftMargin + 36.5 + 4 * 58,
				y: 175,
				fontSize: settings.headerFontSize,
				fontStyle: settings.headerStyle,
				fontFamily: settings.headerFont,
			})
		})


	.then(input => {
			//TODO: IMPLEMENTAR QUEBRA DE LINHA
			return actions.formBox(input.doc, {
				x: settings.leftMargin,
				y: 178.5,
				h: 10.5,
				w: 291,
				header: {
					text: '58-Observacao / Justificativa ',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: 0,
				},
				content:{
					text: _.has(data, 'observacao') ? data.observacao : '',
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
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
			return actions.formBox(input.doc, {
				x: settings.leftMargin,
				y: 189.5,
				h: 7.28,
				w: 41.14,
				header: {
					text: '59-Total de Procedimentos (R$)',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: 0,
				},
				content: {
					text: _.has(data, 'valorTotal.valorProcedimentos') ? data.valorTotal.valorProcedimentos : createBlock('|__', 8) + ',' + createBlock('|__', 2),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 0.5 + 41.14,
				y: 189.5,
				h: 7.28,
				w: 41.14,
				header: {
					text: '60 - Total de Taxas e Alugueis (R$)',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: 0,
				},
				content: {
					text: _.has(data, 'valorTotal.valorTaxasAlugueis') ? data.valorTotal.valorTaxasAlugueis : createBlock('|__', 8) + ',' + createBlock('|__', 2),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 2 * (0.5 + 41.14),
				y: 189.5,
				h: 7.28,
				w: 41.14,
				header: {
					text: '61 - Total de Materiais (R$)',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: 0,
				},
				content: {
					text: _.has(data, 'valorTotal.valorMateriais') ? data.valorTotal.valorMateriais : createBlock('|__', 8) + ',' + createBlock('|__', 2),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 3 * (0.5 + 41.14),
				y: 189.5,
				h: 7.28,
				w: 41.14,
				header: {
					text: '62 - Total OPME (R$)',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: 0,
				},
				content: {
					text: _.has(data, 'valorTotal.valorOPME') ? data.valorTotal.valorOPME : createBlock('|__', 8) + ',' + createBlock('|__', 2),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 4 * (0.5 + 41.14),
				y: 189.5,
				h: 7.28,
				w: 41.14,
				header: {
					text: '63 - Total de Medicamentos (R$)',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: 0,
				},
				content: {
					text: _.has(data, 'valorTotal.valorMedicamentos') ? data.valorTotal.valorMedicamentos : createBlock('|__', 8) + ',' + createBlock('|__', 2),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 5 * (0.5 + 41.14),
				y: 189.5,
				h: 7.28,
				w: 41.14,
				header: {
					text: '64 - Total de Gases Medicinais (R$)',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: 0,
				},
				content: {
					text: _.has(data, 'valorTotal.valorGasesMedicinais') ? data.valorTotal.valorGasesMedicinais : createBlock('|__', 8) + ',' + createBlock('|__', 2),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 6 * (0.5 + 41.14),
				y: 189.5,
				h: 7.28,
				w: 41.14,
				header: {
					text: '65 - Total Geral (R$)',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: 0,
				},
				content: {
					text:_.has(data, 'valorTotal.valorTotalGeral') ? data.valorTotal.valorTotalGeral : createBlock('|__', 8) + ',' + createBlock('|__', 2),
					fontSize: settings.contentFontSize,
					fontStyle: settings.contentFontStyle,
					fontFamily: settings.contentFont,
				}
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin,
				y: 197.5,
				h: 7.28,
				w: 96.33,
				header: {
					text: '66 - Assinatura do Responsavel pela Autorizacao',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: 0,
				},
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + (96.33 + 1),
				y: 197.5,
				h: 7.28,
				w: 96.33,
				header: {
					text: '67 - Assinatura do Beneficiario ou Responsavel',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: 0,
				},
			})
		})
		.then(input => {
			return actions.formBox(input.doc, {
				x: settings.leftMargin + 2 * (96.33 + 1),
				y: 197.5,
				h: 7.28,
				w: 96.33,
				header: {
					text: '68 - Assinatura do Contratado',
					fontSize: settings.headerFontSize,
					fontStyle: settings.headerStyle,
					fontFamily: settings.headerFont,
					padding: 0,
				},
			})
		})
		.then(actions.saveDoc)
		.then(input => {
			return Promise.resolve(input)
		})
}