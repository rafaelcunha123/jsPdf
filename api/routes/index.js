const express = require('express')
const router = express.Router()

const print = require('../controllers/print.controllers.js')

router
	.route('/spsadt')
	.post(print.controller)

	router
	.route('/consulta')
	.post(print.controller)


module.exports = router