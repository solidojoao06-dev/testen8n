const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// @route   GET api/products
// @desc    Get all products
// @access  Public (for customer-facing site) / Private (for admin stock view)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

// @route   POST api/products
// @desc    Create a new product (for admin)
// @access  Private
router.post('/', async (req, res) => {
    const { name, description, price, quantity, image, sku } = req.body;
    try {
        const newProduct = new Product({
            name,
            description,
            price,
            quantity,
            image,
            sku
        });
        const product = await newProduct.save();
        res.status(201).json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});


// @route   PUT api/products/:id
// @desc    Update a product (e.g., stock quantity)
// @access  Private (for admin)
router.put('/:id', async (req, res) => {
    const { name, description, price, quantity, image, sku } = req.body;

    // Build product object
    const productFields = {};
    if (name) productFields.name = name;
    if (description) productFields.description = description;
    if (price) productFields.price = price;
    if (quantity !== undefined) productFields.quantity = quantity;
    if (image) productFields.image = image;
    if (sku) productFields.sku = sku;

    try {
        let product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ msg: 'Produto não encontrado' });

        product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: productFields },
            { new: true }
        );

        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

module.exports = router;
