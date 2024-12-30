import { useState, useEffect, useRef } from "react";
import axios from "axios";
import './Chatbot.css'; // Importar el archivo de estilos

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const welcomeSent = useRef(false); // Usamos useRef para evitar re-renderizados
  const messagesEndRef = useRef(null); // Ref para el último mensaje

  // Función para enviar el mensaje de texto al backend
  const df_text_query = async (queryText) => {
    let says = {
      speaks: 'user',
      msg: {
        text: {
          text: queryText
        }
      }
    };

    console.log("Enviando mensaje al backend:", queryText); // Log de lo que se está enviando

    setMessages((prevMessages) => [...prevMessages, says]);
    setInput("");

    try {
      console.log("Haciendo la solicitud POST al backend...");

      const res = await axios.post('http://localhost:5000/api/df_text_query', { text: queryText });

      console.log("Respuesta del backend:", res.data); // Verifica la respuesta completa aquí

      // Modificación para manejar fulfillmentText en lugar de fulfillmentMessages
      if (res.data.fulfillmentText) {
        says = {
          speaks: 'bot',
          msg: {
            text: {
              text: res.data.fulfillmentText
            }
          }
        };
        setMessages((prevMessages) => [...prevMessages, says]);
      } else {
        console.error("No se encontró 'fulfillmentText' en la respuesta");
      }
    } catch (error) {
      console.error('Error al enviar el mensaje', error);
    }
  };

  // Función para manejar el envío del mensaje con "Enter"
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      console.log("Presionó Enter, enviando el mensaje:", input); // Log cuando se presiona Enter
      df_text_query(input);
    }
  };

  // Función para enviar el mensaje de bienvenida cuando el componente se monta
  useEffect(() => {
    if (!welcomeSent.current) {
      // Enviar un mensaje inicial del bot (bienvenida) si no se ha enviado antes
      console.log("Enviando mensaje de bienvenida al backend");
      df_text_query("¡Hola! ¿En qué puedo ayudarte hoy?");
      welcomeSent.current = true; // Marcar que el mensaje de bienvenida ya se envió
    }
  }, []); // Solo ejecutarse una vez cuando el componente se monte

  // Efecto para hacer scroll al último mensaje cuando se actualicen los mensajes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Se ejecuta cada vez que los mensajes cambian

  return (
    <div className="chatbot-container">
      <div className="chatbot-box">
        <div className="chatbot-header">
          <h2>Chatbot</h2>
        </div>

        <div className="chatbot-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chatbot-message ${message.speaks === "user" ? "user" : "bot"}`}
            >
              {message.msg.text ? message.msg.text.text : message.msg}
            </div>
          ))}
          {/* Elemento para hacer scroll al final */}
          <div ref={messagesEndRef} />
        </div>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress} // Detecta la tecla "Enter"
          placeholder="Escribe un mensaje..."
          className="chatbot-input"
        />
      </div>
    </div>
  );
}
