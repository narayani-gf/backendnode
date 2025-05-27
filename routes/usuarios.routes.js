const router = require('express').Router()
const usuarios = require('../controllers/usuarios.controller')
const Authorize = require('../middlewares/auth.middleware')

// GET: api/usuarios
router.get('/', Authorize('Administrador'), usuarios.getAll)

// GET: api/usuarios/email
router.get('/:email', Authorize('Administrador'), usuarios.get)

// POST: api/usuarios
router.post('/', Authorize('Administrador'), usuarios.createUsuarioValidator, usuarios.create)

// POST: api/usuarios/compradores
router.post('/compradores', usuarios.createUsuarioCompradorValidator, usuarios.createComprador)

// PUT: api/usuarios/email
router.put('/:email', Authorize('Administrador'), usuarios.updateUsuarioValidator, usuarios.update)

// DELETE: api/usuarios/email
router.delete('/:email', Authorize('Administrador'), usuarios.delete)

module.exports = router