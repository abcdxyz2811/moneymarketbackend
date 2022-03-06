const mongoose = require("mongoose");

const struct = mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
    },
    cpassword: {
        type: String
    },
    img:String,
    login_date:String,
    logout_date:String,
    role:String,
    online:Boolean,
    token: String

})

const result = mongoose.model("Userdata", struct);

module.exports = result;