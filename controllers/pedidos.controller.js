const { pedido, sequelize, pedidoproducto } = require('../models')
const fs = require("fs")

let self = {}

// POST: api/pedidos
self.create = async function (req, res, next) {
    const t = await sequelize.transaction()

    try {
        let newOrder = await pedido.create({
            usuarioid: req.body.usuarioid
        }, { transaction: t })

        for (let product of req.body.productos) {
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