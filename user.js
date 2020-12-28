const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    isActive: {
        type: Boolean,
        require: true
    },
    createdON: {
        type: Date,
        require: Date.now()
    },
});


mongoose.model('users', userSchema);

module.exports = mongoose.model('users');