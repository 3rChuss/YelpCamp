const mongoose = require('mongoose');
//COMMENTS SCHEMA
const commentSchema = new mongoose.Schema({
    text: String, 
    author: String
});
module.exports = mongoose.model('Comments', commentSchema);