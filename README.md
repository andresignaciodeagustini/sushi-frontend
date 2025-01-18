@"
# Sushi Bot Frontend 🍱

Interfaz de usuario para el chatbot de pedidos de sushi desarrollada con React y Vite.

## Instalación

1. Clonar el repositorio
\`\`\`bash
git clone https://github.com/andresignaciodeagustini/sushi-frontend.git
cd sushi-frontend
\`\`\`

2. Instalar dependencias
\`\`\`bash
npm install
\`\`\`

3. Configurar variables de entorno
\`\`\`bash
cp .env.example .env
# Editar VITE_API_URL con la URL de tu API
\`\`\`

4. Iniciar el servidor de desarrollo
\`\`\`bash
npm run dev
\`\`\`

## Guía de Uso del Chatbot

### 🍣 Consulta de Menú y Precios
- Consultar menú completo:
  - "Menú por favor"
  - "Ver carta"
  - "Mostrar menú"
  - "¿Qué tipos de sushi tienen?"

- Consultar rolls específicos:
  - "¿Hay [tipo de roll] disponible?"
  - "Precio del [tipo de roll]"
  - "¿Cuánto cuesta el [tipo de roll]?"
  - "¿Tienen [tipo de roll]?"

Rolls disponibles:
- California Roll
- Philadelphia Roll
- Sake Roll
- Hot Roll
- Crunchy Roll
- Veggie Roll
- Cucumber Roll

### 🛵 Consultas sobre Delivery
- "¿Hacen delivery?"
- "¿Hacen envíos?"
- "¿Cuánto tarda el delivery?"
- "¿Llevan a domicilio?"
- "¿Hasta dónde hacen entregas?"
- "¿El delivery es gratis?"
- "¿Cuánto cuesta el envío?"

### 🕒 Consultas de Horarios
- "Horarios de atención"
- "¿Están abiertos ahora?"
- "¿Trabajan los domingos?"
- "¿Qué días atienden?"
- "¿Cuál es su horario?"
- "¿A qué hora abren/cierran?"
- "¿Están atendiendo?"

### 💳 Medios de Pago
- "Formas de pago"
- "¿Trabajan con tarjetas?"
- "¿Aceptan débito/crédito?"
- "¿Tienen Mercado Pago?"
- "¿Aceptan efectivo?"
- "¿Qué medios de pago aceptan?"

### 📦 Realizar Pedidos
- "Ordenar sushi"
- "Hacer un pedido"
- "Quiero hacer un pedido"
- "Realizar un pedido"
- "Quiero pedir sushi"

### 🏠 Menú Principal
- "Volver al inicio"
- "Necesito ayuda"
- "¿Cómo funciona?"
- "Opciones"
- "Menú principal"

## Ejemplo de Flujo de Pedido

1. Consultar menú:
   - Usuario: "Mostrar menú"
   - Bot: [Muestra lista de rolls disponibles]

2. Consultar precio específico:
   - Usuario: "¿Cuánto cuesta el California Roll?"
   - Bot: [Muestra precio del roll]

3. Realizar pedido:
   - Usuario: "Quiero hacer un pedido"
   - Bot: [Guía paso a paso para el pedido]

4. Confirmar detalles:
   - Bot: [Muestra resumen del pedido]
   - Usuario: "Confirmar pedido"

## Tecnologías

- React 18
- Vite
- Axios para peticiones HTTP
- React Chat Widget
- Material UI

## Características

- Interfaz de chat intuitiva y responsive
- Integración con Dialogflow
- Procesamiento de pedidos en tiempo real
- Historial de conversación
- Sugerencias de mensajes rápidos
- Validación de inputs
- Feedback visual de estados

## Scripts

- \`npm run dev\`: Inicia el servidor de desarrollo
- \`npm run build\`: Construye la aplicación para producción
- \`npm run preview\`: Vista previa de la build

## Estructura del Proyecto

\`\`\`
src/
├── components/     # Componentes React
├── services/      # Servicios de API
├── hooks/         # Custom hooks
├── utils/         # Utilidades
└── assets/        # Recursos estáticos
\`\`\`
"@ | Out-File -FilePath README.md -Encoding UTF8

