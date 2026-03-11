const mongoose = require('mongoose')

const binomerSchema = new mongoose.Schema(
    {
        user_id: {
            type: String,
            required: true,
        },
        author_id: {
            type: String,
            required: true,
        },
    },
    { 
        id: false,
    }
)

module.exports = mongoose.model("Binomer", binomerSchema)