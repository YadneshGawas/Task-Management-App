import Chat from "../schemas/chat.js";

export const fetchMessage = async(req,res) => {
    const messages = await Chat.find().sort('timestamp');
    res.json(messages);
}

export const writeMessage = async(req,res) => {
    const { name: user } = req.user;
    const {  message } = req.body;
    const newMessage = new Chat({user, message});
    await newMessage.save();
    res.json(newMessage);
}