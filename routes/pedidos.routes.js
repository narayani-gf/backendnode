const router = require('express').Router()
const pedidos = require('../controllers/pedidos.controller')
const Authorize = require('../middlewares/auth.middleware')

// POST: api/pedidos
router.post('/', Authorize('Usuario'), pedidos.create)

// DELETE: api/pedidos/5
router.delete('/:id', Authorize('Usuario'), pedidos.delete)

module.exports = router