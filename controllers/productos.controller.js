const { producto, categoria, Sequelize } = require('../models')
const { body, validationResult } = require('express-validator');
const Op = Sequelize.Op

let self = {}

self.productoValidator = [
    body('titulo').not().isEmpty().withMessage("El campo 'titulo' es obligatorio")
    .isLength({ max: 254 }).withMessage("El campo 'titulo' no debe exceder los 254 caracteres"),
    body('descripcion').not().isEmpty().withMessage("El campo 'descripcion' es obligatorio")
    .isLength({ max: 254 }).withMessage("El campo 'descripcion' no debe exceder los 254 caracteres"),
    body('precio').not().isEmpty().withMessage("El campo 'precio' es obligatorio")
    .isDecimal({ force_decimal: false }).withMessage("El campo 'precio' es tiene que ser decimal"),
]

// GET: api/productos
self.getAll = async function (req, res, next) {
    try {
        // Recibe el parámetro de búsqueda
        const { s } = req.query

        // Filtro para buscar
        const filters = {}
        if (s) {
            filters.titulo = {
                [Op.like]: `%${s}%`
            }
        }

        let data = await producto.findAll({
            where: filters,
            attributes: [['id', 'productoId'], 'titulo', 'descripcion', 'precio', 'archivoid'],
            include: {
                model: categoria,
                attributes: [['id', 'categoriaId'], 'nombre', 'protegida'],
                through: { attributes: [] }
            },
            subQuery: false
        })
        return res.status(200).json(data)
    } catch (error) {
        next(error)
    }
}

// GET: api/productos/5
self.get = async function (req, res, next) {
    try {
        let id = req.params.id
        let data = await producto.findByPk(id, {
            attributes: [['id', 'productoId'], 'titulo', 'descripcion', 'precio', 'archivoid'],
            include: {
                model: categoria,
                attributes: [['id', 'categoriaId'], 'nombre', 'protegida'],
                through: { attributes: [] }
            }
        })

        if (data)
            res.status(200).json(data)
        else
            res.status(404).send()
    } catch (error) {
        next(error)
    }
}

// POST: api/productos
self.create = async function (req, res, next) {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty())
            return res.status(400).json({
                message: "Errores de validación",
                errors: errors.array().map(err => err.msg)
            });

        let data = await producto.create({
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            archivoid: req.body.archivoid || null
        })

        // Bitácora
        req.bitacora("producto.crear", data.id)
        res.status(201).json(data)
    } catch (error) {
        next(error)
    }
}

// PUT: api/productos/5
self.update = async function (req, res, next) {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty())
            return res.status(400).json({
                message: "Errores de validación",
                errors: errors.array().map(err => err.msg)
            });

        let id = req.params.id
        let body = req.body
        let data = await producto.update(body, { where: { id: id } })

        if (data[0] === 0)
            return res.status(404).send()

        // Bitácora
        req.bitacora("producto.editar", id)
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}

// DELETE: api/productos/5
self.delete = async function (req, res, next) {
    try {
        const id = req.params.id
        let data = await producto.findByPk(id)

        if (!data)
            return res.status(404).send()

        data = await producto.destroy({ where: { id: id } })

        if (data === 1) {
            // Bitácora
            req.bitacora("producto.eliminar", id)
            return res.status(204).send()
        }

        res.status(404).send()
    } catch (error) {
        next(error)
    }
}

// POST: api/productos/5/categoria
self.asignaCategoria = async function (req, res, next) {
    try {
        let itemToAssign = await categoria.findByPk(req.body.categoriaid);
        
        if (!itemToAssign)
            return res.status(404).send()

        let item = await producto.findByPk(req.params.id);

        if (!item)
            return res.status(404).send()

        await item.addCategoria(itemToAssign)

        // Bitácora
        req.bitacora("productocategoria.agregar", `${req.params.id}:${req.body.categoriaid}`)
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}

// DELETE: api/productos/5/categoria/1
self.eliminaCategoria = async function (req, res, next) {
    try {
        let itemToRemove = await categoria.findByPk(req.params.categoriaid);

        if (!itemToRemove)
            return res.status(404).send()

        let item = await producto.findByPk(req.params.id);
        
        if (!item)
            return res.status(404).send()

        await item.removeCategoria(itemToRemove)

        // Bitácora
        req.bitacora("productocategoria.remover", `${req.params.id}:${req.params.categoriaid}`)
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}

module.exports = self