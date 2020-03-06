const mongoose = require('mongoose');

//SCHEMA USERS
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comments'
        }
    ]
});
module.exports = mongoose.model('User', userSchema);