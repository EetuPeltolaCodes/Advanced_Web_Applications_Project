import React, { useState, useEffect } from 'react';

function ChatInterface({ userId, matchUserId, matchUserName }) {
    const [messages, setMessages] = useState([]);   // State to make list of the messages
    const [newMessage, setNewMessage] = useState(''); // State to the new message sent

    // Fetch chat data for the specified match (userId and matchUserId)
    useEffect(() => { 
        fetch(`/api/chat/${userId}/${matchUserId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => response.json())
        .then((data) => {

            // Fetch individual messages
            const promises = data.messages.map(messageId => (
                fetch(`/api/message/${messageId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then(response => response.json())
            ));

            Promise.all(promises)
                .then(individualMessages => setMessages(individualMessages))  // Set messages to the list
                .catch(error => console.error('Error fetching individual messages:', error));
        })
        .catch((error) => {
            console.error('Fetch error:', error);
        });
    }, [userId, matchUserId]);

    const handleSendMessage = () => {
        console.log('Sending message:', newMessage);
        // Post the new message to the backend
        fetch(`/api/send-message/${userId}/${matchUserId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({message: newMessage})
        })
        .then((response) => response.json())
        .then((data) => {
        // Update the UI with the newly sent message
        setMessages((prevMessages) => [...prevMessages, data.message]);
        setNewMessage(''); // Clear the input field after sending            
        })
    };

    return (
        /*This is the container for the whole chat */
        <div className="chat-container">
            {/*This is the container for the messages */}
            <div className="message-container">
                {/*Show all the earlier messages between the users */}
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`message-bubble ${userId === message.sentBy ? 'message-bubble-you' : ''}`}
                    >
                        <strong>{userId === message.sentBy ? 'You' : matchUserName}</strong>
                        <p>{message.information}</p>
                    </div>
                ))}
            </div>
            {/*This is the container for the messages input */}
            <div className="message-input-container">
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                {/*Button to send a new message written in the input */}
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
}

export default ChatInterface;
