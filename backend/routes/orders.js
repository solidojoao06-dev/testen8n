const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// @route   POST api/orders
// @desc    Create a new order
// @access  Public
router.post('/', async (req, res) => {
    const { cart } = req.body;

    if (!cart || cart.length === 0) {
        return res.status(400).json({ msg: 'O carrinho está vazio' });
    }

    try {
        let total = 0;
        const orderItems = [];

        for (const item of cart) {
            const product = await Product.findById(item.id);
            if (!product) {
                return res.status(404).json({ msg: `Produto com id ${item.id} não encontrado.` });
            }
            if (product.quantity < item.quantity) {
                return res.status(400).json({ msg: `Estoque insuficiente para ${product.name}` });
            }

            total += item.quantity * product.price;
            orderItems.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
            });
        }

        // Create and save the new order
        const newOrder = new Order({
            items: orderItems,
            total: total,
        });
        const savedOrder = await newOrder.save();

        // Update stock
        for (const item of savedOrder.items) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { quantity: -item.quantity },
            });
        }

        res.status(201).json(savedOrder);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

// @route   GET api/orders
// @desc    Get all orders
// @access  Private (for admin)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

// @route   PUT api/orders/:id
// @desc    Update order status
// @access  Private (for admin)
router.put('/:id', async (req, res) => {
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ msg: 'O novo status é obrigatório.' });
    }

    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ msg: 'Pedido não encontrado.' });
        }

        order.status = status;
        await order.save();

        res.json(order);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

module.exports = router;
