import { useState, useEffect, useRef } from "react";
import axios from "axios";
import './Chatbot.css';
import Card from '../card/card';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const welcomeSent = useRef(false);
  const messagesEndRef = useRef(null);

  const updateMessages = (newMessage) => {
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, newMessage];
      console.log("Mensajes actualizados:", updatedMessages);
      localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
      return updatedMessages;
    });
  };

  const df_text_query = async (queryText) => {
    let says = {
      speaks: 'user',
      msg: {
        text: {
          text: queryText
        }
      }
    };

    console.log("Enviando mensaje al backend:", queryText);
    updateMessages(says);
    setInput("");

    try {
      console.log("Haciendo la solicitud POST al backend...");
      const res = await axios.post('http://localhost:5000/api/df_text_query', { text: queryText });
      console.log("Respuesta del backend:", res.data);

      let textProcessed = false;
      let processedCards = false;

      if (res.data.fulfillmentText) {
        says = {
          speaks: 'bot',
          msg: {
            text: {
              text: res.data.fulfillmentText
            }
          }
        };
        updateMessages(says);
        textProcessed = true;
      }

      if (res.data.fulfillmentMessages) {
        res.data.fulfillmentMessages.forEach((message) => {
          if (message.payload && message.payload.fields && message.payload.fields.cards && !processedCards) {
            console.log("Procesando tarjetas...");

            const cards = message.payload.fields.cards.listValue.values.map(item => ({
              header: item.structValue.fields.header.stringValue,
              description: item.structValue.fields.description.stringValue
            }));

            console.log("Tarjetas procesadas:", cards);

            says = {
              speaks: 'bot',
              msg: {
                payload: cards
              }
            };
            updateMessages(says);
            processedCards = true;
          } else if (message.text && !textProcessed) {
            const msgText = message.text.text[0];
            if (msgText !== res.data.fulfillmentText) {
              says = {
                speaks: 'bot',
                msg: {
                  text: {
                    text: msgText
                  }
                }
              };
              updateMessages(says);
            }
            textProcessed = true;
          }
        });
      }
    } catch (error) {
      console.error('Error al enviar el mensaje', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      console.log("Presionó Enter, enviando el mensaje:", input);
      df_text_query(input);
    }
  };

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      console.log("Cargando mensajes guardados:", savedMessages);
      setMessages(JSON.parse(savedMessages));
    } else if (!welcomeSent.current) {
      console.log("Enviando mensaje de bienvenida al backend");
      df_text_query("¡Hola! ¿En qué puedo ayudarte hoy?");
      welcomeSent.current = true;
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chatbot-container">
      <div className="chatbot-box">
        <div className="chatbot-header">
          <h2>Chatbot</h2>
        </div>

        <div className="chatbot-messages">
          {messages.map((message, index) => {
            if (message.msg.payload) {
              console.log("Mensaje con tarjetas:", message.msg.payload);
              return (
                <div key={index} className="chatbot-message bot">
                  <div className="card-panel">
                    <div style={{ overflow: 'hidden' }}>
                      <div className="col s2">
                        <a href="/" className="btn-floating btn-large waves-effect waves-light red">{message.speaks}</a>
                      </div>
                      <div style={{ overflow: 'auto', overflowY: 'scroll' }}>
                        <div style={{ height: 300, width: message.msg.payload.length * 270 }}>
                          {message.msg.payload.map((card, i) => {
                            console.log("Tarjeta que se pasa a Card:", card);
                            return <Card key={i} payload={card} />;
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={index} className={`chatbot-message ${message.speaks === "user" ? "user" : "bot"}`}>
                {message.msg.text ? message.msg.text.text : message.msg}
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe un mensaje..."
          className="chatbot-input"
        />
      </div>
    </div>
  );
}
