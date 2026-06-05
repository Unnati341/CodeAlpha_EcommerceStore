const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    items: [
        {
            
            productId: String,
            title: String,
            price: Number,
            qty: Number,
            image: String,
        }
    ],

    total: Number,

    status: {
        type: String,
        default: "Placed" 
        // Placed | Cancelled | Delivered
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Order", orderSchema);