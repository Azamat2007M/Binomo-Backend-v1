const mongoose = require('mongoose')

const coinSchema = new mongoose.Schema(
    {
        symbol: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
    },
    { 
        id: false,
    }
)

module.exports = mongoose.model("Coin", coinSchema)