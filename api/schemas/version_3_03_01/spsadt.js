//PERMISSIVE VALIDATION. WILL ONLY CLEAN UNDESIREABLE DATA, BUT WILL ALLOW IMPRESSION OF INCOMPLETE FORMS

const joi = require('joi')
const customJoi = require('../../validators/customJoi.js').customJoi
const commonSchemas = require('./commonSchemas.js')
const lists = require('./lists.js')


const valorTotalSchema = joi.object().keys({
	valorProcedimentos: joi.string().regex(/^\d{1,10}(\.\d{0,2})?$/),
	valorDiarias: joi.string().regex(/^\d{1,10}(\.\d{0,2})?$/),
	valorTaxasAlugueis: joi.string().regex(/^\d{1,10}(\.\d{0,2})?$/),
	valorMateriais: joi.string().regex(/^\d{1,10}(\.\d{0,2})?$/),
	valorMedicamentos: joi.string().regex(/^\d{1,10}(\.\d{0,2})?$/),
	valorOPME: joi.string().regex(/^\d{1,10}(\.\d{0,2})?$/),
	valorGasesMedicinais: joi.string().regex(/^\d{1,10}(\.\d{0,2})?$/),
	valorTotalGeral: joi.string().regex(/^\d{1,10}(\.\d{0,2})?$/),
})


const profissionaisSchema = joi.array().items({
	sequencialReferencia: joi.number().integer().min(1).max(99),
	grauParticipacao: joi.string().valid(lists.grauPart),
	codProfissional: joi.object().keys({
		codigoPrestadorNaOperadora: joi.string().min(1).max(14),
		cpfContratado: customJoi.string().isCPF(),
	}).xor('codigoPrestadorNaOperadora', 'cpfContratado'),
	nomeProfissional: joi.string().min(1).max(70),
	conselhoProfissional: joi.string().valid(lists.conselhoProfissional),
	numeroConselhoProfissional: joi.string().min(1).max(15),
	UF: joi.string().valid(lists.UF),
	CBOS: joi.string().valid(lists.CBOS)
}).max(4)

const procedimentosRealizadosSchema = joi.array().items({
		dataExecucao: customJoi.string().isDateStr(),
		horaInicial: customJoi.string().isHourStr(),
		horaFinal: customJoi.string().isHourStr(),
		procedimento: commonSchemas.procedimentoSchema,
		quantidadeExecutada: joi.string().regex(/^\d{1,8}(\.\d{0,4})?$/),
		viaAcesso: joi.string().valid(["1", "2", "3"]),
		tecnicaUtilizada:joi.string().valid(["1", "2", "3"]),
		reducaoAcrescimo: joi.string().regex(/^\d{1,3}(\.\d{0,2})?$/),
		valorUnitario: joi.string().regex(/^\d{1,8}(\.\d{0,2})?$/),
		valorTotal: joi.string().regex(/^\d{1,8}(\.\d{0,4})?$/),
		profissionais: profissionaisSchema
}).max(5)


const dadosAtendimentoSchema = joi.object().keys({
	tipoAtendimento: joi.string().valid([lists.tipoAtendimento]),
	indicacaoAcidente: joi.string().valid(["0", "1", "2", "9"]),
	tipoConsulta: joi.string().valid(["1", "2", "3", "4"]),
	motivoEncerramento: joi.string().valid(["41", "42", "43"])
})

const dadosExecutanteSchema = joi.object().keys({
	contratadoExecutante: commonSchemas.dadosContratadoSchema,
	CNES: joi.string().min(1).max(7)
})

const procedimentosSolicitados = joi.object().keys({
	procedimento: commonSchemas.procedimentoSchema,
	quantidadeSolicitada: joi.number().integer().min(1).max(999),
	quantidadeAutorizada: joi.number().integer().min(1).max(999),
})

const dadosSolicitacaoSchema = joi.object().keys({
	dataSolicitacao: customJoi.string().isDateStr(),
	caraterAtendimento: joi.string().regex(/[1-2]{1}/),
	indicacaoClinica: joi.string().min(1).max(500)
})

const dadosSolicitanteSchema = joi.object().keys({
	contratadoSolicitante: commonSchemas.dadosContratadoSchema,
	profissionalSolicitante: commonSchemas.profissionalSolicitanteSchema
})


const autorizacaoSPSADTSchema = joi.object().keys({
	numeroGuiaOperadora: joi.string().min(1).max(20),
	dataAutorizacao: customJoi.string().isDateStr(),
	senha: joi.string().min(1).max(20),
	dataValidadeSenha: customJoi.string().isDateStr()
})

const cabecalhoSPSADTSchema = joi.object().keys({
	registroANS: joi.string().regex(/[0-9]{6}/),
	numeroGuiaPrestador: joi.string().min(1).max(20),
	guiaPrincipal: joi.string().min(1).max(20),
})


const guiaSPSADTSchema = joi.object().keys({
	cabecalhoGuia: cabecalhoSPSADTSchema,
	dadosAutorizacao: autorizacaoSPSADTSchema,
	dadosBeneficiario: commonSchemas.dadosBeneficiarioSchema,
	dadosSolicitante: dadosSolicitanteSchema,
	dadosSolicitacao: dadosSolicitacaoSchema,
	procedimentosSolicitados: joi.array().items(procedimentosSolicitados).max(5),
	dadosExecutante: dadosExecutanteSchema,
	dadosAtendimento: dadosAtendimentoSchema,
	procedimentosRealizados: procedimentosRealizadosSchema,
	//outrasDespesas: outrasDespesasSchemas,
	observacao: joi.string().min(1).max(500),
	valorTotal: valorTotalSchema
})


const spsadtFormSchema = joi.object().keys({
	cabecalho: joi.object().keys({
		padrao: joi.string().required(),
	}).required(),
	guiaSPSADT: guiaSPSADTSchema
})


//-- EXPORTS --

module.exports = {
	spsadt: spsadtFormSchema
}