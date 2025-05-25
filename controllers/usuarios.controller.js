const { usuario, rol, Sequelize } = require('../models')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
const crypto = require('crypto')

let self = {}

self.createUsuarioValidator = [
    body('nombre').not().isEmpty().withMessage("El campo 'nombre' es obligatorio"),
    body('rol').not().isEmpty().withMessage("El campo 'rol' es obligatorio"),
    body('email').not().isEmpty().withMessage("El campo 'email' es obligatorio"),
    body('email').isEmail().withMessage('El correo electrónico no es válido'),
    body('password')
    .not().isEmpty().withMessage("El campo 'password' es obligatorio")
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/[a-z]/).withMessage('La contraseña debe incluir al menos una minúscula')
    .matches(/[A-Z]/).withMessage('La contraseña debe incluir al menos una mayúscula')
    .matches(/[0-9]/).withMessage('La contraseña debe incluir al menos un número')
    .matches(/[^A-Za-z0-9]/).withMessage('La contraseña debe incluir al menos un carácter especial')
]

self.updateUsuarioValidator = [
    body('email').isEmail().withMessage('El correo electrónico no es válido'),
    body('password')
    .not().isEmpty().withMessage("El campo 'password' es obligatorio")
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/[a-z]/).withMessage('La contraseña debe incluir al menos una minúscula')
    .matches(/[A-Z]/).withMessage('La contraseña debe incluir al menos una mayúscula')
    .matches(/[0-9]/).withMessage('La contraseña debe incluir al menos un número')
    .matches(/[^A-Za-z0-9]/).withMessage('La contraseña debe incluir al menos un carácter especial')
]

// GET: api/usuarios
self.getAll = async function (req, res, next) {
    try {
        const data = await usuario.findAll({
            raw: true,
            attributes: ['id', 'email', 'nombre', [Sequelize.col('rol.nombre'), 'rol']],
            include: { model: rol, attributes: [] }
        })

        res.status(200).json(data)
    } catch (error) {
        next(error)
    }
}

// GET: api/usuarios/email
self.get = async function (req, res, next) {
    try {
        const email = req.params.email
        const data = await usuario.findOne({
            where: { email: email },
            raw: true,
            attributes: ['id', 'email', 'nombre', [Sequelize.col('rol.nombre'), 'rol']],
            include: { model: rol, attributes: [] }
        })

        res.status(200).json(data)
    } catch (error) {
        next(error)
    }
}

// POST: api/usuarios
self.create = async function (req, res, next) {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty())
            return res.status(400).json({
                message: "Errores de validación",
                errors: errors.array().map(err => err.msg)
            });

        const rolusuario = await rol.findOne({ where: { nombre: req.body.rol } })

        if (!rolusuario)
            return res.status(404).send("Rol no encontrado")

        const data = await usuario.create({
            id: crypto.randomUUID(),
            email: req.body.email,
            passwordhash: await bcrypt.hash(req.body.password, 10),
            nombre: req.body.nombre,
            rolid: rolusuario.id
        })

        // Bitácora
        req.bitacora("usuarios.crear", data.email)

        res.status(201).json({
            id: data.id,
            email: data.email,
            nombre: data.nombre,
            rolid: rolusuario.nombre
        })
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            return res.status(400).json({
                error: "El correo electrónico ya está registrado.",
                fields: error.errors.map(e => e.path)
            });
        }

        next(error)
    }
}

// PUT: api/usuarios/email
self.update = async function (req, res, next) {
    try {
        const email = req.params.email
        const rolusuario = await rol.findOne({ where: { nombre: req.body.rol } })
        
        if (!rolusuario)
            return res.status(404).send("Rol no encontrado")

        req.body.rolid = rolusuario.id

        const data = await usuario.update(req.body, {
            where: { email: email },
        })

        if (data[0] === 0)
            return res.status(404).send()

        // Bitácora
        req.bitacora("usuarios.editar", email)
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}

// DELETE: api/usuarios/email
self.delete = async function (req, res, next) {
    try {
        const email = req.params.email
        let data = await usuario.findOne({ where: { email: email } })

        // No se pueden eliminar usuarios protegidos
        if (data.protegido)
            return res.status(403).send()

        data = await usuario.destroy({ where: { email: email } })

        if (data === 1) {
            // Bitácora
            req.bitacora("usuarios.eliminar", email)
            return res.status(204).send() // Elemento eliminado
        }

        res.status(404).send()
    } catch (error) {
        next(error)
    }
}

module.exports = self