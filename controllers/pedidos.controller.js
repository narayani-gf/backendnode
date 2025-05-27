const { pedido, sequelize, pedidoproducto, producto, usuario } = require('../models')
const fs = require("fs")
const { body, validationResult } = require('express-validator');

let self = {}

self.pedidoValidator = [
    body('usuarioid').isUUID().withMessage("id de usuario inválido"),
    body('productos').isArray({ min: 1 }).withMessage("Se requiere al menos un producto"),
    body('productos.*.productoid').isInt().withMessage("El id del producto debe ser un entero"),
    body('productos.*.cantidad')
        .isInt({ min: 1, max: 100 }).withMessage("La cantidad debe ser un número entero positivo entre 1 y 100")
]

// POST: api/pedidos
self.create = async function (req, res, next) {
    const t = await sequelize.transaction()

    try {
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(400).json({
                message: "Errores de validación",
                errors: errors.array().map(err => err.msg)
            });

        const user = await usuario.findOne({ where: { id: req.body.usuarioid } })

        if (!user)
            return res.status(404).send("Usuario no encontrado")

        let newOrder = await pedido.create({
            usuarioid: user.id
        }, { transaction: t })

        for (let product of req.body.productos) {
            const existedProduct = await producto.findOne({ where: { id: product.productoid } })

            if (!existedProduct)
                return res.status(404).send(`Producto con el id ${product.productoid} no encontrado`)

            await pedidoproducto.create({
                pedidoid: newOrder.id,
                productoid: product.productoid,
                cantidad: product.cantidad
            }, { transaction: t })
        }

        await t.commit()

        // Bitacora
        req.bitacora("pedido.crear", newOrder.id)
        res.status(201).json(newOrder)
    } catch (error) {
        await t.rollback()
        next(error)
    }
}

// DELETE: api/pedidos/5
self.delete = async function (req, res, next) {
    try {
        const id = req.params.id
        let data = await pedido.findByPk(id)

        if (!data)
            return res.status(404).send()

        data = await pedido.destroy({ where: { id: id } })

        if (data === 1) {
            // Bitácora
            req.bitacora("pedido.eliminar", id)
            return res.status(204).send()
        }

        res.status(404).send()
    } catch (error) {
        next(error)
    }
}

module.exports = self