const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let userSchema = new Schema({
    name: String,
    username: String,
    password: String,
    description: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    image: {
        name: String,
        encoding: String,
        mimetype: String,
        buffer: Buffer, // Buffer for storing image data
      },
});

module.exports = mongoose.model("Users", userSchema);