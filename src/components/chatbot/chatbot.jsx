import { useState, useEffect, useRef } from "react";
import axios from "axios";
import './Chatbot.css';
import Card from '../card/card';
import QuickReplies from '../quick-replies/QuickReplies';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const welcomeSent = useRef(false);
  const messagesEndRef = useRef(null);
  const isMounted = useRef(true);
  const [isTyping, setIsTyping] = useState(false);

  const toggleChatbot = () => {
    setIsVisible(!isVisible);
    if (!isVisible && messages.length === 0) {
      df_text_query("¡Hola! ¿En qué puedo ayudarte hoy?");
    }
  };

  const updateMessages = (newMessage) => {
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, newMessage];
      try {
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
      } catch (error) {
        console.error("Error al guardar los mensajes en localStorage:", error);
      }
      return updatedMessages;
    });
  };

  const df_text_query = async (queryText) => {
    let says = {
      speaks: 'user',
      msg: {
        text: queryText
      }
    };

    updateMessages(says);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post('http://localhost:5000/api/df_text_query', { text: queryText });
      
      let allMessages = [];
      if (res.data.fulfillmentText) {
        says = {
          speaks: 'bot',
          msg: {
            text: res.data.fulfillmentText
          }
        };
        allMessages.push(says);
      }

      if (res.data.payloads) {
        res.data.payloads.forEach((payload) => {
          if (payload.type === 'cards') {
            const cards = payload.data.map(item => ({
              header: item.structValue.fields.header.stringValue,
              description: item.structValue.fields.description.stringValue
            }));

            says = {
              speaks: 'bot',
              msg: {
                payload: cards
              }
            };
            allMessages.push(says);
          } else if (payload.type === 'quick_replies') {
            const quickReplies = payload.data.map(item => ({
              title: item.structValue.fields.text.stringValue,
              payload: item.structValue.fields.payload?.stringValue ?? item.structValue.fields.text.stringValue,
              link: item.structValue.fields.link?.stringValue ?? "http://www.defaultlink.com"
            }));

            says = {
              speaks: 'bot',
              msg: {
                quickReplies: quickReplies,
                text: payload.text
              }
            };
            allMessages.push(says);
          } else if (payload.type === 'text') {
            says = {
              speaks: 'bot',
              msg: {
                text: payload.data
              }
            };
            allMessages.push(says);
          }
        });
      }

      setIsTyping(false);
      allMessages.forEach((message) => updateMessages(message));
    } catch (error) {
      console.error('Error al enviar el mensaje', error);
      setIsTyping(false);
    }
  };

  const _handleQuickReplyPayload = async (event, payload, text) => {
    event.preventDefault();
    event.stopPropagation();
    await df_text_query(text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      df_text_query(input);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chatbot-wrapper">
      <button 
        onClick={toggleChatbot} 
        className={`chatbot-toggle-button ${isVisible ? 'open' : ''}`}
        aria-label={isVisible ? 'Cerrar chat de ayuda' : 'Abrir chat de ayuda'}
      >
        {isVisible ? (
          'Cerrar chat'
        ) : (
          <>
            <span className="pulse-dot"></span>
            ¿Necesitas ayuda?
          </>
        )}
      </button>

      {isVisible && (
        <div className="chatbot-container">
          <div className="chatbot-box">
            <div className="chatbot-header">
              <h2>Asistente Virtual</h2>
            </div>

            <div className="chatbot-messages">
              {messages.map((message, index) => (
                <div key={index} className={`chatbot-message ${message.speaks}`}>
                  {message.msg.payload ? (
                    <div className="cards-container">
                      {message.msg.payload.map((card, i) => (
                        <Card key={i} payload={card} />
                      ))}
                    </div>
                  ) : message.msg.quickReplies ? (
                    <>
                      <div className="message-text">
                        {message.msg.text && <p>{typeof message.msg.text === 'string' ? message.msg.text : message.msg.text.text}</p>}
                      </div>
                      <div className="quick-replies">
                        {message.msg.quickReplies.map((reply, i) => (
                          <button
                            key={i}
                            onClick={(event) => _handleQuickReplyPayload(event, reply.payload, reply.title)}
                            className="quick-reply-button"
                          >
                            {reply.title}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p>{message.msg.text}</p>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="chatbot-message bot typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chatbot-input-container">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje aquí..."
                className="chatbot-input"
              />
              <button 
                onClick={() => input.trim() && df_text_query(input)}
                className="chatbot-send-button"
                disabled={!input.trim()}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}