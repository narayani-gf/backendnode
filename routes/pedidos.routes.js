const router = require('express').Router()
const pedidos = require('../controllers/pedidos.controller')
const Authorize = require('../middlewares/auth.middleware')

// POST: api/pedidos
router.post('/', Authorize('Usuario'), pedidos.pedidoValidator, pedidos.create)

// GET: api/pedidos
router.get('/', Authorize('Administrador'), pedidos.getAll)

// DELETE: api/pedidos/5
router.delete('/:id', Authorize('Usuario'), pedidos.delete)

module.exports = router