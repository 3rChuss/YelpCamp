const        mongoose   =   require('mongoose'),
passportLocalMongoose   =   require('passport-local-mongoose');

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
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);