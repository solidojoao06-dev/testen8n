const mongoose = require('mongoose');

const OrderedItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: {
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
    },
});

const OrderSchema = new mongoose.Schema({
    items: [OrderedItemSchema],
    total: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['Novo', 'Em Separação', 'Embalado', 'Enviado', 'Concluído', 'Cancelado'],
        default: 'Novo',
    },
    customerInfo: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
    },
    paymentDetails: {
        method: { type: String, default: 'Credit Card' },
        // In a real app, you would store a transaction ID from the payment gateway, not card details.
        transactionId: { type: String },
        paymentStatus: { type: String, default: 'Pending' },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Order', OrderSchema);
