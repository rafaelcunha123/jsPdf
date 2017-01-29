const joi = require('joi')
const lists = require('./lists.js')
const customJoi = require('../../validators/customJoi.js').customJoi

exports.dadosBeneficiarioSchema = joi.object().keys({
	numeroCarteira: joi.string().alphanum().min(1).max(20),
	validadeCarteira: customJoi.string().isDateStr(),
	atendimentoRN: joi.string().valid(["S", "N"]),
	nomeBeneficiario: joi.string().min(1).max(70),
	numeroCNS: joi.string().alphanum().min(1).max(15),
	identificadorBeneficiario: joi.string().regex(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/)
})

exports.dadosContratadoSchema = joi.object().keys({
	codigoPrestadorNaOperadora: joi.string().alphanum().min(1).max(14),
	cpfContratado: customJoi.string().isCPF(),
	cnpjContratado: customJoi.string().isCNPJ(),
	nomeContratado: joi.string().min(1).max(70),
}).xor('codigoPrestadorNaOperadora', 'cpfContratado', 'cnpjContratado')

exports.profissionalSolicitanteSchema = joi.object().keys({
	nomeProfissional: joi.string().min(1).max(70),
	conselhoProfissional: joi.string().valid(lists.conselhoProfissional),
	numeroConselhoProfissional: joi.string().regex(/[0-9]{1,15}/),
	UF: joi.string().valid(lists.UF),
	CBOS: joi.string().valid(lists.CBOS),
})

exports.dadosExecutanteSchema = joi.object().keys({
	codigonaOperadora: joi.string().min(1).max(14),
	nomeContratado: joi.string().min(1).max(70),
	CNES: joi.string().min(1).max(7)
})

exports.procedimentoSchema = joi.object().keys({
	codigoTabela: joi.string().valid(lists.dm_tabela),
	codigoProcedimento: joi.string().min(1).max(10),
	descricaoProcedimento: joi.string().min(1).max(150)
})
