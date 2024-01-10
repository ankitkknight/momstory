const mongoose = require('mongoose');
const { Schema } = mongoose;

const savedStoriesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
    },
    description: {
        type: [],
        required: true,
    },
    date: {
        type: String,
        default: Date.now
    }

});

module.exports = mongoose.model('savedstories2', savedStoriesSchema);