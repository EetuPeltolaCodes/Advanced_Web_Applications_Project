const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let messageSchema = new Schema({
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    information: String,
});

module.exports = mongoose.model("Message", messageSchema)