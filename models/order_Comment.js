const mongoose = require('mongoose');

// set the schema
let OrderCommentSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    postId: String,
    createdAt: {
        type: Date,
        default: new Date()
    },
});

let Order_Comment = mongoose.model('Order_comment', OrderCommentSchema);

module.exports = Order_Comment;
