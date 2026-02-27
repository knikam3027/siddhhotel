import React, { useState, useRef, useEffect } from 'react';
import ApiService from '../../service/ApiService';
import './ChatBot.css';

const ChatBot = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! 👋 I'm your Siddhi Hotel assistant. How can I help you today? I can help you with:\n• Room recommendations\n• Hotel information\n• Booking guidance\n• Pune attractions & travel tips\n• Room availability and pricing",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!inputValue.trim()) return;

        // Add user message to chat
        const userMessage = {
            id: messages.length + 1,
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages([...messages, userMessage]);
        setInputValue('');
        setLoading(true);

        try {
            // Call backend chatbot API using ApiService
            const response = await ApiService.chatWithBot(inputValue);
            const botMessage = {
                id: messages.length + 2,
                text: response.botReply,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            let errorText = "Sorry, I'm having trouble connecting. Please try again later.";
            if (error.response?.data?.message) {
                errorText = `Error: ${error.response.data.message}`;
            }
            const errorMessage = {
                id: messages.length + 2,
                text: errorText,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearChat = () => {
        setMessages([
            {
                id: 1,
                text: "Hello! 👋 I'm your Siddhi Hotel assistant. How can I help you today? I can help you with:\n• Room recommendations\n• Hotel information\n• Booking guidance\n• Pune attractions & travel tips\n• Room availability and pricing",
                sender: 'bot',
                timestamp: new Date()
            }
        ]);
    };

    return (
        <>
            {/* Chat Button */}
            <button 
                className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                title="Chat with our assistant"
            >
                {isOpen ? '✕' : '💬'}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-container">
                    <div className="chatbot-header">
                        <div className="chatbot-title">
                            <span className="bot-icon">🤖</span>
                            <span>Siddhi Hotel Assistant</span>
                        </div>
                        <button 
                            className="clear-chat-btn"
                            onClick={handleClearChat}
                            title="Clear conversation"
                        >
                            🔄
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`message ${message.sender}`}
                            >
                                {message.sender === 'bot' && <span className="bot-avatar">🤖</span>}
                                <div className={`message-content ${message.sender}`}>
                                    <p>{message.text}</p>
                                    <span className="message-time">
                                        {message.timestamp.toLocaleTimeString([], { 
                                            hour: '2-digit', 
                                            minute: '2-digit' 
                                        })}
                                    </span>
                                </div>
                                {message.sender === 'user' && <span className="user-avatar">👤</span>}
                            </div>
                        ))}
                        {loading && (
                            <div className="message bot">
                                <span className="bot-avatar">🤖</span>
                                <div className="message-content bot typing">
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="chatbot-input-form">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask me anything about hotels, rooms, or Pune..."
                            disabled={loading}
                            className="chatbot-input"
                        />
                        <button
                            type="submit"
                            disabled={loading || !inputValue.trim()}
                            className="send-button"
                        >
                            {loading ? '⏳' : '📤'}
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default ChatBot;
