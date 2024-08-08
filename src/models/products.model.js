
const mongoose = require('mongoose');

const ProductSchema = ({
    title: {
        type: String,
        required: true
    },

    category: String,

    size: String
});


module.exports = mongoose.model('Products', ProductSchema )