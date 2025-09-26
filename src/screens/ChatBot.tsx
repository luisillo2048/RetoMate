import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "http://192.168.1.13:8000";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  options?: string[];
  isQuestion?: boolean;
  isCorrect?: boolean;
  showRecommendation?: boolean;
  recommendation?: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
};

type ChatState = {
  step: 'inicio' | 'saludo' | 'seleccion_bloque' | 'seleccion_tema' | 'respondiendo' | 'completado';
  bloque?: number;
  tema?: string;
  numeroPregunta?: number;
  totalPreguntas?: number;
  esperandoListo?: boolean;
  preguntaActual?: string;
};

const ChatBot = ({ visible, onClose }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [nextEndpoint, setNextEndpoint] = useState<string | null>(null);
  const [chatState, setChatState] = useState<ChatState>({ step: 'inicio' });
  const [options, setOptions] = useState<string[]>([]);
  const [esperandoListo, setEsperandoListo] = useState(false);
  const { user } = useAuth();

  const flatListRef = useRef<FlatList<Message>>(null);

  const iniciarChat = async () => {
    try {
      if (!user) {
        setMessages([{
          id: Date.now().toString(),
          text: "❌ Debes iniciar sesión para usar el chatbot",
          sender: "bot"
        }]);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/chatbot/inicio/${user.id}`);
      const data = await res.json();

      if (data.error) {
        setMessages([{
          id: Date.now().toString(),
          text: data.error,
          sender: "bot"
        }]);
        return;
      }

      const newMessage: Message = {
        id: Date.now().toString(),
        text: data.mensaje || "👋 Hola, soy tu chatbot",
        sender: "bot",
      };

      if (data.opciones) {
        newMessage.options = data.opciones;
        setOptions(data.opciones);
      }

      setMessages([newMessage]);
      setNextEndpoint(data.siguiente?.endpoint || null);
      
      if (data.siguiente?.endpoint === "/chatbot/saludo") setChatState({ step: 'saludo' });
      else if (data.siguiente?.endpoint === "/chatbot/seleccionar_bloque") setChatState({ step: 'seleccion_bloque' });

    } catch (err) {
      console.error("Error iniciando chatbot:", err);
      setMessages([{
        id: Date.now().toString(),
        text: "❌ Error conectando con el servidor. Verifica que la API esté ejecutándose.",
        sender: "bot"
      }]);
    }
  };

  const enviarMensaje = async () => {
    if (!input.trim() && !esperandoListo) return;

    if (esperandoListo && input.trim().toLowerCase() !== "listo") {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "Escribe 'listo' cuando estés preparado para continuar",
        sender: "bot"
      }]);
      setInput("");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };
    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput("");

    try {
      let requestBody: any = {};
      let endpointToUse = nextEndpoint;

      switch (chatState.step) {
        case 'saludo':
          requestBody = { user_id: user?.id, texto: userInput };
          endpointToUse = "/chatbot/saludo";
          break;

        case 'seleccion_bloque':
          const bloqueNum = parseInt(userInput);
          if (!isNaN(bloqueNum) && bloqueNum >= 1 && bloqueNum <= 4) {
            requestBody = { user_id: user?.id, bloque: bloqueNum };
            endpointToUse = "/chatbot/seleccionar_bloque";
          } else {
            setMessages(prev => [...prev, {
              id: Date.now().toString(),
              text: "Por favor, selecciona un bloque válido (1-4)",
              sender: "bot"
            }]);
            return;
          }
          break;

        case 'seleccion_tema':
          requestBody = { user_id: user?.id, tema: userInput.toLowerCase() };
          endpointToUse = "/chatbot/seleccionar_tema";
          break;

        case 'respondiendo':
          requestBody = { user_id: user?.id, respuesta: userInput };
          endpointToUse = "/chatbot/responder";
          break;

        default:
          requestBody = { user_id: user?.id, texto: userInput };
      }

      if (endpointToUse) {
        const res = await fetch(`${API_BASE_URL}${endpointToUse}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        const data = await res.json();

        if (data.error) {
          setMessages(prev => [...prev, { id: Date.now().toString(), text: data.error, sender: "bot" }]);
          return;
        }

        const botMessages: Message[] = [];

        if (data.correcto === true) {
          botMessages.push({
            id: Date.now().toString() + '_correct',
            text: data.mensaje || "¡Respuesta correcta! 🎉",
            sender: "bot",
            isCorrect: true
          });
          if (data.siguiente_pregunta) {
            botMessages.push({
              id: Date.now().toString() + '_pregunta',
              text: data.siguiente_pregunta,
              sender: "bot",
              isQuestion: true
            });
          }
        } else if (data.correcto === false) {
          botMessages.push({
            id: Date.now().toString() + '_incorrect',
            text: data.mensaje || "❌ Respuesta incorrecta",
            sender: "bot",
            isCorrect: false,
            showRecommendation: true,
            recommendation: data.recomendacion
          });
          if (data.mensaje_listo) {
            botMessages.push({
              id: Date.now().toString() + '_listo',
              text: data.mensaje_listo,
              sender: "bot"
            });
            setEsperandoListo(true);
          }
        } else {
          const botMessage: Message = {
            id: Date.now().toString(),
            text: data.pregunta || data.mensaje || "🤖 ...",
            sender: "bot",
            isQuestion: !!data.pregunta,
          };
          if (data.opciones) {
            botMessage.options = data.opciones;
            setOptions(data.opciones);
          }
          botMessages.push(botMessage);
        }

        setMessages(prev => [...prev, ...botMessages]);
        setNextEndpoint(data.siguiente?.endpoint || null);

        // Actualizar estado
        if (endpointToUse === "/chatbot/saludo") setChatState({ step: 'seleccion_bloque' });
        else if (endpointToUse === "/chatbot/seleccionar_bloque") setChatState({ step: 'seleccion_tema' });
        else if (endpointToUse === "/chatbot/seleccionar_tema") {
          setChatState({ 
            step: 'respondiendo',
            bloque: chatState.bloque,
            tema: userInput.toLowerCase(),
            numeroPregunta: data.numero_pregunta,
            totalPreguntas: data.total_preguntas,
            preguntaActual: data.pregunta
          });
        } else if (endpointToUse === "/chatbot/responder") {
          if (data.completado) {
            setChatState({ step: 'completado' });
            setEsperandoListo(false);
          } else {
            setChatState(prev => ({
              ...prev,
              numeroPregunta: data.numero_pregunta,
              preguntaActual: data.siguiente_pregunta || data.pregunta
            }));
            setEsperandoListo(false);
          }
        }
      }
    } catch (err) {
      console.error("Error enviando mensaje:", err);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "❌ Error de conexión. Intenta nuevamente.",
        sender: "bot"
      }]);
    }
  };

  const seleccionarOpcion = (opcion: string) => {
    setInput(opcion);
    setTimeout(() => enviarMensaje(), 100);
  };

  useEffect(() => {
    if (visible) {
      setMessages([]);
      setChatState({ step: 'inicio' });
      setOptions([]);
      setEsperandoListo(false);
      iniciarChat();
    }
  }, [visible]);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  return (
    <Modal visible={visible} animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: "#f2f2f2" }}
      >
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", padding: 15, backgroundColor: "#3182ce" }}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold", marginLeft: 10 }}>
            Chatbot Matemático
            {chatState.tema && ` - ${chatState.tema}`}
            {chatState.numeroPregunta && ` (${chatState.numeroPregunta}/${chatState.totalPreguntas})`}
          </Text>
        </View>

        {/* Mensajes */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{
              alignSelf: item.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: item.isCorrect === true ? "#4caf50" : item.isCorrect === false ? "#f44336" :
                item.sender === "user" ? "#3182ce" : "#e0e0e0",
              borderRadius: 15,
              padding: 10,
              margin: 8,
              maxWidth: "80%",
            }}>
              <Text style={{ color: item.sender === "user" || item.isCorrect !== undefined ? "#fff" : "#000", fontSize: 16 }}>
                {item.text}
              </Text>
              {item.showRecommendation && item.recommendation && (
                <View style={{ marginTop: 10, padding: 8, backgroundColor: "rgba(255, 255, 255, 0.2)", borderRadius: 8 }}>
                  <Text style={{ color: "#fff", fontStyle: "italic" }}>💡 {item.recommendation}</Text>
                </View>
              )}
              {item.options && (
                <View style={{ marginTop: 10 }}>
                  {item.options.map((opcion, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => seleccionarOpcion(opcion)}
                      style={{ backgroundColor: item.sender === "user" ? "#1e60a1" : "#c0c0c0", padding: 8, borderRadius: 8, marginTop: 5 }}
                    >
                      <Text style={{ color: item.sender === "user" ? "#fff" : "#000", textAlign: 'center' }}>{opcion}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
          style={{ flex: 1, padding: 10 }}
        />

        {/* Input */}
        <View style={{ padding: 10, borderTopWidth: 1, borderColor: "#ddd", backgroundColor: "#fff" }}>
          {options.length > 0 && !esperandoListo && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
              {options.map((opcion, index) => (
                <TouchableOpacity key={index} onPress={() => seleccionarOpcion(opcion)} style={{ backgroundColor: "#3182ce", padding: 8, borderRadius: 15, margin: 4 }}>
                  <Text style={{ color: "#fff", fontSize: 14 }}>{opcion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {esperandoListo && (
            <View style={{ backgroundColor: "#fff3cd", padding: 10, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: "#ffeaa7" }}>
              <Text style={{ color: "#856404", textAlign: "center" }}>Escribe "listo" para continuar con la pregunta</Text>
            </View>
          )}

          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={{ flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 20, paddingHorizontal: 15, fontSize: 16, marginRight: 10 }}
              value={input}
              onChangeText={setInput}
              placeholder={esperandoListo ? "Escribe 'listo'..." : "Escribe tu respuesta..."}
              onSubmitEditing={enviarMensaje}
            />
            <TouchableOpacity onPress={enviarMensaje} style={{ backgroundColor: "#3182ce", borderRadius: 20, padding: 10, justifyContent: "center", alignItems: "center" }}>
              <Ionicons name="send" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ChatBot;
