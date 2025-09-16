const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 0,
    },
    image: {
        type: String,
        required: false, // Not all products might have an image initially
    },
    sku: {
        type: String,
        required: false, // SKU can be added later
        unique: true,
        sparse: true, // Allows multiple documents to have a null value for sku
    }
});

module.exports = mongoose.model('Product', ProductSchema);
