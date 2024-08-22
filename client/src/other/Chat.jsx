import { useState } from 'react';
import { useFetchMessagesQuery, useSendMessageMutation } from '../redux/slice/api/chatApi';

const Chatbox = () => {
    const [message, setMessage] = useState('');

    const { data: messages = [], refetch } = useFetchMessagesQuery();
    const [sendMessage] = useSendMessageMutation();

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (message) {
            await sendMessage({ message });
            setMessage('');
            refetch();
        }
    };

    return (
        <div>
            <div>
                {messages.map((msg) => (
                    <div key={msg._id}>
                        <strong>{msg.user}</strong>: {msg.message}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage}>
                <input
                    type="text"
                    placeholder="Your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chatbox;
