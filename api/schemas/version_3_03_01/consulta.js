const joi = require('joi')
const customJoi = require('../../validators/customJoi.js').customJoi
const commonSchemas = require('./commonSchemas.js')
const lists = require('./lists.js')



const dadosAtendimentoSchema = joi.object().keys({
	dataAtendimento: customJoi.string().isDateStr(),
	tipoConsulta: joi.string().valid(lists.tipoConsulta),
	procedimento: commonSchemas.procedimentoSchema,
	valorProcedimento: joi.string().regex(/^\d{1,10}(\.\d{0,2})?$/),
})

const cabecalhoConsultaSchema = joi.object().keys({
	registroANS: joi.string().regex(/[0-9]{6}/),
	numeroGuiaPrestador: joi.string().min(1).max(20),
})


const guiaConsultaSchema = joi.object().keys({
	cabecalhoConsulta: cabecalhoConsultaSchema,
	numeroGuiaOperadora: joi.string().min(1).max(20),
	dadosBeneficiario: commonSchemas.dadosBeneficiarioSchema,
	contratadoExecutante: commonSchemas.dadosContratadoSchema,
	CNES: joi.string().min(1).max(7),
	profissionalExecutante: commonSchemas.profissionalSolicitanteSchema,
	indicacaoAcidente: joi.string().valid(["0", "1", "2", "9"]),
	dadosAtendimento: dadosAtendimentoSchema,
	observacao: joi.string().min(1).max(500),



})

const consultaFormSchema = joi.object().keys({
	cabecalho: joi.object().keys({
		padrao: joi.string().required(),
	}).required(),
	guiaConsulta: guiaConsultaSchema
})


//-- EXPORTS --

module.exports = {
	consulta: consultaFormSchema
}