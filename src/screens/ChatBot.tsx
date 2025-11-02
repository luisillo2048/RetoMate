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
  Animated,
  Easing,
  Dimensions,
  ActivityIndicator
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "https://chatbot-educativo-production.up.railway.app";
const { width } = Dimensions.get("window");

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  options?: string[];
  type?: "welcome" | "question" | "error";
};

type Props = {
  visible: boolean;
  onClose: () => void;
};

type ChatState = {
  step: "inicio" | "seleccion_bloque" | "seleccion_tema" | "respondiendo" | "completado";
  bloque?: number;
  tema?: string;
  numeroPregunta?: number;
  totalPreguntas?: number;
};

const ChatBot = ({ visible, onClose }: Props) => {
  const { user, token, loading } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [chatState, setChatState] = useState<ChatState>({ step: "inicio" });
  const [nextEndpoint, setNextEndpoint] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const flatListRef = useRef<FlatList<Message>>(null);
  const messageIdCounter = useRef(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const generateUniqueId = () => {
    messageIdCounter.current += 1;
    return `msg_${messageIdCounter.current}_${Date.now()}`;
  };

  // Animación del robot
  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [visible]);

  // Iniciar chat
  const iniciarChat = async () => {
    if (loading) return;
    
    if (!user?.id) {
      setMessages([
        {
          id: generateUniqueId(),
          text: "❌ Debes iniciar sesión para usar el chatbot",
          sender: "bot",
          type: "error",
        },
      ]);
      return;
    }

    setMessages([]);
    setOptions([]);
    setChatState({ step: "inicio" });
    setIsLoading(true);

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/chatbot/inicio/${user.id}`, {
        method: 'GET',
        headers: headers,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 404) {
          throw new Error("Usuario no encontrado en el servidor");
        } else if (response.status === 500) {
          throw new Error("Error interno del servidor");
        } else {
          throw new Error(`Error HTTP: ${response.status}`);
        }
      }
      
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // CORRECCIÓN: Reemplazar "Usuario_ID" por el username real
      let mensajeCorregido = data.mensaje;
      if (user?.username && mensajeCorregido.includes("Usuario_")) {
        const usuarioIdPattern = /Usuario_[a-f0-9]+/;
        if (usuarioIdPattern.test(mensajeCorregido)) {
          mensajeCorregido = mensajeCorregido.replace(usuarioIdPattern, user.username);
        }
      }

      const saludo: Message = {
        id: generateUniqueId(),
        text: mensajeCorregido,
        sender: "bot",
        type: "welcome",
        options: data.opciones || ["1", "2", "3", "4"],
      };

      setMessages([saludo]);
      setOptions(saludo.options || []);
      setNextEndpoint("/chatbot/seleccionar_bloque");
      setChatState({ step: "seleccion_bloque" });

    } catch (err: any) {
      let errorMessage = "❌ Error conectando con el servidor";
      
      if (err.message.includes("Usuario no encontrado")) {
        errorMessage = "❌ Usuario no encontrado. Por favor, inicia sesión nuevamente.";
      } else if (err.message.includes("500") || err.message.includes("interno")) {
        errorMessage = "❌ Error del servidor. Intenta nuevamente en unos momentos.";
      }
      
      setMessages([
        {
          id: generateUniqueId(),
          text: errorMessage,
          sender: "bot",
          type: "error",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (visible && user) {
      messageIdCounter.current = 0;
      iniciarChat();
    }
  }, [visible, user, loading]);

  // Enviar mensaje
  const enviarMensaje = async () => {
    if (!input.trim() || isLoading || !user?.id) return;

    const userMessage: Message = {
      id: generateUniqueId(),
      text: input,
      sender: "user",
    };
    
    setMessages((prev) => [...prev, userMessage]);
    const textoUsuario = input;
    setInput("");
    setIsLoading(true);

    try {
      let body: any = { user_id: user.id };
      let endpoint = nextEndpoint;

      if (chatState.step === "seleccion_bloque") {
        const bloqueNum = parseInt(textoUsuario);
        if (isNaN(bloqueNum) || bloqueNum < 1 || bloqueNum > 4) {
          setMessages((prev) => [
            ...prev,
            {
              id: generateUniqueId(),
              text: "Selecciona un bloque válido del 1 al 4 🔢",
              sender: "bot",
              type: "error",
            },
          ]);
          setIsLoading(false);
          return;
        }
        body.bloque = bloqueNum;
        endpoint = "/chatbot/seleccionar_bloque";
      } else if (chatState.step === "seleccion_tema") {
        body.tema = textoUsuario.toLowerCase();
        endpoint = "/chatbot/seleccionar_tema";
      } else if (chatState.step === "respondiendo") {
        body.respuesta = textoUsuario;
        endpoint = "/chatbot/responder";
      }

      if (!endpoint) {
        setIsLoading(false);
        return;
      }

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "Accept": "application/json",
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401) {
          throw new Error("No autorizado - token inválido");
        } else if (response.status === 500) {
          throw new Error("Error interno del servidor");
        } else {
          throw new Error(`Error HTTP: ${response.status}`);
        }
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // CORRECCIÓN: Reemplazar automáticamente el ID por el username
      let botMessageText = data.mensaje || data.pregunta || data.siguiente_pregunta || "Continúa...";
      
      // Si el mensaje contiene "Usuario_" seguido de un ID, reemplazarlo por el username real
      if (user?.username && botMessageText.includes("Usuario_")) {
        const usuarioIdPattern = /Usuario_[a-f0-9]+/;
        if (usuarioIdPattern.test(botMessageText)) {
          botMessageText = botMessageText.replace(usuarioIdPattern, user.username);
        }
      }

      // CORRECCIÓN: Si hay una pregunta o siguiente_pregunta y no está incluida en el mensaje, la agregamos
      if (data.pregunta && !botMessageText.includes(data.pregunta)) {
        botMessageText += `\n\n${data.pregunta}`;
      } else if (data.siguiente_pregunta && !botMessageText.includes(data.siguiente_pregunta)) {
        botMessageText += `\n\n${data.siguiente_pregunta}`;
      }

      const botMsg: Message = {
        id: generateUniqueId(),
        text: botMessageText,
        sender: "bot",
        type: data.pregunta ? "question" : data.completado ? "welcome" : "welcome",
        options: data.opciones,
      };

      setMessages((prev) => [...prev, botMsg]);
      setOptions(botMsg.options || []);
      setNextEndpoint(data.siguiente?.endpoint || null);

      // Actualizar estado del chat
      if (endpoint === "/chatbot/seleccionar_bloque") {
        setChatState({ 
          step: "seleccion_tema", 
          bloque: parseInt(textoUsuario) 
        });
      } else if (endpoint === "/chatbot/seleccionar_tema") {
        setChatState({
          step: "respondiendo",
          tema: textoUsuario.toLowerCase(),
          numeroPregunta: data.numero_pregunta || 1,
          totalPreguntas: data.total_preguntas || 5,
        });
      } else if (endpoint === "/chatbot/responder") {
        if (data.completado) {
          setChatState({ step: "completado" });
          setNextEndpoint("/chatbot/seleccionar_bloque");
        } else {
          setChatState(prev => ({
            ...prev,
            numeroPregunta: data.numero_pregunta || (prev.numeroPregunta || 0) + 1
          }));
        }
      }

    } catch (err: any) {
      let errorMessage = "❌ Error de conexión";
      
      if (err.message.includes("500") || err.message.includes("interno")) {
        errorMessage = "❌ Error del servidor. Intenta nuevamente.";
      } else if (err.message.includes("No autorizado")) {
        errorMessage = "❌ Sesión expirada. Por favor, inicia sesión nuevamente.";
      }
      
      setMessages((prev) => [
        ...prev,
        {
          id: generateUniqueId(),
          text: errorMessage,
          sender: "bot",
          type: "error",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const seleccionarOpcion = (opcion: string) => {
    setInput(opcion);
    setTimeout(() => {
      enviarMensaje();
    }, 100);
  };

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const getMessageStyle = (message: Message) => {
    const base = { 
      borderRadius: 18, 
      padding: 12, 
      marginVertical: 4, 
      marginHorizontal: 8, 
      maxWidth: width * 0.8 
    };
    
    if (message.sender === "user") 
      return { 
        ...base, 
        backgroundColor: "#6366F1", 
        borderBottomRightRadius: 6, 
        alignSelf: "flex-end" 
      };
    
    if (message.type === "error") 
      return { 
        ...base, 
        backgroundColor: "#EF4444", 
        alignSelf: "flex-start", 
        borderBottomLeftRadius: 6 
      };
    
    if (message.type === "question") 
      return { 
        ...base, 
        backgroundColor: "#8B5CF6", 
        alignSelf: "flex-start", 
        borderBottomLeftRadius: 6 
      };
    
    return { 
      ...base, 
      backgroundColor: "#FFFFFF", 
      borderWidth: 1, 
      borderColor: "#E5E7EB", 
      alignSelf: "flex-start", 
      borderBottomLeftRadius: 6 
    };
  };

  const getMessageTextStyle = (message: Message) => {
    if (message.sender === "user" || message.type === "error") 
      return { color: "#FFF", fontSize: 16 };
    
    return { color: "#000", fontSize: 16 };
  };

  const handleClose = () => {
    setMessages([]);
    setInput("");
    setOptions([]);
    setChatState({ step: "inicio" });
    setNextEndpoint(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1, backgroundColor: "#F0F9FF" }}
      >
        {/* HEADER */}
        <View style={{ 
          backgroundColor: "#6366F1", 
          paddingTop: Platform.OS === "ios" ? 50 : 10, 
          paddingBottom: 10, 
          borderBottomLeftRadius: 16, 
          borderBottomRightRadius: 16 
        }}>
          <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="arrow-back" size={22} color="#FFF" />
            </TouchableOpacity>
            
            <Animated.View style={{ 
              marginLeft: 10, 
              transform: [{ scale: pulseAnim }], 
              width: 36, 
              height: 36, 
              borderRadius: 18, 
              backgroundColor: "#FFF", 
              justifyContent: "center", 
              alignItems: "center" 
            }}>
              <FontAwesome5 name="robot" size={18} color="#6366F1" />
            </Animated.View>
            
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "bold" }}>
                Amigo Matemático
              </Text>
              <Text style={{ color: "#E0E7FF", fontSize: 12 }}>
                {chatState.tema ? `Tema: ${chatState.tema}` : "Aprendiendo juntos"}
                {chatState.numeroPregunta && ` • ${chatState.numeroPregunta}/${chatState.totalPreguntas}`}
              </Text>
            </View>

            {isLoading && (
              <ActivityIndicator size="small" color="#FFF" />
            )}
          </View>
        </View>

        {/* LISTA DE MENSAJES */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={getMessageStyle(item)}>
              <Text style={getMessageTextStyle(item)}>
                {item.text}
              </Text>
              
              {item.options && item.options.length > 0 && (
                <View style={{ marginTop: 8 }}>
                  {item.options.map((opcion, idx) => (
                    <TouchableOpacity 
                      key={idx} 
                      onPress={() => seleccionarOpcion(opcion)} 
                      style={{ 
                        backgroundColor: "#8B5CF6", 
                        padding: 10, 
                        borderRadius: 10, 
                        marginTop: 5 
                      }}
                      disabled={isLoading}
                    >
                      <Text style={{ color: "#FFF", textAlign: "center", fontSize: 14 }}>
                        {opcion}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingVertical: 10 }}
          showsVerticalScrollIndicator={false}
        />

        {/* INPUT */}
        <View style={{ 
          padding: 12, 
          borderTopWidth: 1, 
          borderColor: "#E5E7EB", 
          backgroundColor: "#FFF" 
        }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              style={{ 
                flex: 1, 
                borderWidth: 1, 
                borderColor: isLoading ? "#D1D5DB" : "#E5E7EB", 
                borderRadius: 20, 
                paddingHorizontal: 16, 
                paddingVertical: 10, 
                marginRight: 10, 
                backgroundColor: isLoading ? "#F3F4F6" : "#F9FAFB", 
                fontSize: 15,
                color: isLoading ? "#9CA3AF" : "#000"
              }}
              value={input}
              onChangeText={setInput}
              placeholder={isLoading ? "Enviando..." : "Escribe tu respuesta..."}
              placeholderTextColor="#9CA3AF"
              onSubmitEditing={enviarMensaje}
              editable={!isLoading}
              returnKeyType="send"
            />
            
            <TouchableOpacity 
              onPress={enviarMensaje} 
              disabled={isLoading || !input.trim()}
              style={{ 
                backgroundColor: (isLoading || !input.trim()) ? "#9CA3AF" : "#10B981", 
                width: 44, 
                height: 44, 
                borderRadius: 22, 
                justifyContent: "center", 
                alignItems: "center" 
              }}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Ionicons name="send" size={20} color="#FFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ChatBot;