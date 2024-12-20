const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        fullname: { type: String, required: true},
        username: { type: String, required: true, unique: true},
        email: { type: String, required: true, unique: true},
        address: { type: String, required: true},
        password: { type: String, required: true},
        isAdmin: { type: Boolean, default: false}
    }, { timestamps: true}
    )

module.exports = mongoose.model("User", UserSchema);