const express = require('express')
const router = express.Router()

const print = require('../controllers/print.controllers.js')

router
	.route('/printspsadt')
	.post(print.controller)


module.exports = router