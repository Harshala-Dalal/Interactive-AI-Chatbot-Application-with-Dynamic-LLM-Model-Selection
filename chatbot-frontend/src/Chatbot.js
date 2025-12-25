import { useState, useEffect, useRef } from "react";
import { Send, Trash2 } from "lucide-react"; // Import Trash icon
import styles from "./Chatbot.module.css"; // Import the CSS Module

export default function Chatbot() {
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [selectedModel, setSelectedModel] = useState("instruct");
    const chatEndRef = useRef(null);

    // ✅ Load chat history from localStorage when component mounts
    useEffect(() => {
        const savedChat = localStorage.getItem("chatHistory");
        if (savedChat) {
            try {
                setChatHistory(JSON.parse(savedChat));
            } catch (error) {
                console.error("Error parsing chat history:", error);
                localStorage.removeItem("chatHistory"); // Reset if invalid
            }
        }
    }, []);

    // ✅ Save chat history to localStorage whenever it updates
    useEffect(() => {
        if (chatHistory.length > 0) {
            localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
        }
    }, [chatHistory]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory]);

    const sendMessage = async () => {
        if (!message.trim()) return;

        const newChatHistory = [...chatHistory, { sender: "user", text: message }];
        setChatHistory(newChatHistory);
        setMessage("");

        try {
            const response = await fetch("http://127.0.0.1:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ model: selectedModel, user_message: message }),
            });

            const data = await response.json();
            setChatHistory([...newChatHistory, { sender: "bot", text: data.response }]);
        } catch (error) {
            console.error("Error fetching response:", error);
        }
    };

    // ✅ Function to clear chat history
    const clearChat = () => {
        setChatHistory([]); // Reset state
        localStorage.removeItem("chatHistory"); // Remove from localStorage
    };

    return (
        <div className={styles.chatContainer}>
            {/* Header with Model Selection & Clear Chat Button */}
            <header className={styles.chatHeader}>
                <h2 className={styles.title}>Chatbot</h2>
                
                <div className={styles.controls}>
                    <select 
                        value={selectedModel} 
                        onChange={(e) => setSelectedModel(e.target.value)} 
                        className={styles.modelSelect}
                    >
                        <option value="mistral">Mistral-7B</option>
                        <option value="alpha">Zephyr-7B</option>
                        <option value="phi-2">Microsoft-Phi-2</option>
                        <option value="phi-1_5">Microsoft-Phi-1-5</option>
                        <option value="instruct">Falcon-7B</option>
                    </select>

                    {/* Clear Chat Button */}
                    <button className={styles.clearButton} onClick={clearChat}>
                        <Trash2 size={20} />
                    </button>
                </div>
            </header>

            {/* Chat Messages */}
            <div className={styles.chatBody}>
                {chatHistory.length === 0 ? (
                    <p className={styles.noMessages}>Start a conversation...</p>
                ) : (
                    chatHistory.map((msg, index) => (
                        <div key={index} className={`${styles.message} ${msg.sender === "user" ? styles.user : styles.bot}`}>
                            <div className={msg.sender === "user" ? styles.userMessage : styles.botMessage}>
                                {msg.text}
                            </div>
                        </div>
                    ))
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Chat Input & Send Button */}
            <footer className={styles.chatFooter}>
                <input 
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className={styles.chatInput}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button className={styles.sendButton} onClick={sendMessage}>
                    <Send size={20} color="white" />
                </button>
            </footer>
        </div>
    );
}


/*
import { useState, useEffect, useRef } from "react";
import { Send} from "lucide-react";
import styles from "./Chatbot.module.css"; // Import the CSS Module

export default function Chatbot() {
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [selectedModel, setSelectedModel] = useState("instruct");
    const chatEndRef = useRef(null);


    // Load chat history from localStorage when component mounts
    useEffect(() => {
        const savedChat = localStorage.getItem("chatHistory");
        if (savedChat) {
            try {
                setChatHistory(JSON.parse(savedChat));
            } catch (error) {
                console.error("Error parsing chat history:", error);
                localStorage.removeItem("chatHistory"); // Reset if invalid
            }
        }
    }, []);

    // Save chat history to localStorage whenever it updates
    useEffect(() => {
        if (chatHistory.length > 0) {
            localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
        }
    }, [chatHistory]);


    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory]);

    const sendMessage = async () => {
        if (!message.trim()) return;

        const newChatHistory = [...chatHistory, { sender: "user", text: message }];
        setChatHistory(newChatHistory);
        setMessage("");

        try {
            const response = await fetch("http://127.0.0.1:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ model: selectedModel, user_message: message }),
            });

            const data = await response.json();
            setChatHistory([...newChatHistory, { sender: "bot", text: data.response }]);
        } catch (error) {
            console.error("Error fetching response:", error);
        }
    };


    return (
        <div className={styles.chatContainer}>
            
            <header className={styles.chatHeader}>
                <h2 className={styles.title}>Chatbot</h2>
                <select 
                    value={selectedModel} 
                    onChange={(e) => setSelectedModel(e.target.value)} 
                    className={styles.modelSelect}
                >
                    <option value="mistral">Mistral-7B</option>
                    <option value="alpha">Zephyr-7B</option>
                    <option value="phi-2">Microsoft-Phi-2</option>
                    <option value="phi-1_5">Microsoft-Phi-1-5</option>
                    <option value="instruct">Falcon-7B</option>
                </select>
            </header>

            <div className={styles.chatBody}>
                {chatHistory.map((msg, index) => (
                    <div key={index} className={`${styles.message} ${msg.sender === "user" ? styles.user : styles.bot}`}>
                        <div className={msg.sender === "user" ? styles.userMessage : styles.botMessage}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            <footer className={styles.chatFooter}>
                <input 
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className={styles.chatInput}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button className={styles.sendButton} onClick={sendMessage}>
                    <Send size={20} color="white" />
                </button>
            </footer>
        </div>
    );
}
*/   