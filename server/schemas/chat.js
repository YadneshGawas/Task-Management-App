import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    user: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});

const Chat = mongoose.model('Chat', messageSchema);

export default Chat;