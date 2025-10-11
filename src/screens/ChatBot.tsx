import React, { useState, useEffect, useRef } from "react";
import {View,Text,TouchableOpacity,Modal,TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  Dimensions,
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
  const { user, loading } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [chatState, setChatState] = useState<ChatState>({ step: "inicio" });
  const [nextEndpoint, setNextEndpoint] = useState<string | null>(null);

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

    try {
      const res = await fetch(`${API_BASE_URL}/chatbot/inicio/${user.id}`);
      const data = await res.json();

      const saludo: Message = {
        id: generateUniqueId(),
        text:
          data.mensaje ||
          "👋 ¡Hola! Soy tu amigo matemático 🤖\n\nElige un bloque para comenzar:",
        sender: "bot",
        type: "welcome",
        options: data.opciones || ["1", "2", "3", "4"],
      };

      setMessages([saludo]);
      setOptions(saludo.options || ["1", "2", "3", "4"]);
      setNextEndpoint("/chatbot/seleccionar_bloque");
      setChatState({ step: "seleccion_bloque" });
    } catch (err) {
      console.error(err);
      // Fallback si falla el backend
      const saludo: Message = {
        id: generateUniqueId(),
        text: "👋 ¡Hola! Soy tu amigo matemático 🤖\n\nElige un bloque para comenzar:",
        sender: "bot",
        type: "welcome",
        options: ["1", "2", "3", "4"],
      };
      setMessages([saludo]);
      setOptions(saludo.options);
      setNextEndpoint("/chatbot/seleccionar_bloque");
      setChatState({ step: "seleccion_bloque" });
    }
  };

  useEffect(() => {
    if (visible) {
      messageIdCounter.current = 0;
      iniciarChat();
    }
  }, [visible, user, loading]);

  // Enviar mensaje
  const enviarMensaje = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: generateUniqueId(),
      text: input,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    const textoUsuario = input;
    setInput("");

    try {
      let body: any = {};
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
          return;
        }
        body = { user_id: user?.id, bloque: bloqueNum };
        endpoint = "/chatbot/seleccionar_bloque";
      } else if (chatState.step === "seleccion_tema") {
        body = { user_id: user?.id, tema: textoUsuario.toLowerCase() };
        endpoint = "/chatbot/seleccionar_tema";
      } else if (chatState.step === "respondiendo") {
        body = { user_id: user?.id, respuesta: textoUsuario };
        endpoint = "/chatbot/responder";
      }

      if (!endpoint) return;

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      const botMsg: Message = {
        id: generateUniqueId(),
        text: data.mensaje || data.pregunta || "🤖 ¡Vamos a aprender juntos!",
        sender: "bot",
        type: data.pregunta ? "question" : "welcome",
        options: data.opciones,
      };

      setMessages((prev) => [...prev, botMsg]);
      setOptions(botMsg.options || []);
      setNextEndpoint(data.siguiente?.endpoint || null);

      // Actualizar estado según flujo
      if (endpoint === "/chatbot/seleccionar_bloque")
        setChatState({ step: "seleccion_tema", bloque: parseInt(textoUsuario) });
      else if (endpoint === "/chatbot/seleccionar_tema")
        setChatState({
          step: "respondiendo",
          tema: textoUsuario.toLowerCase(),
          numeroPregunta: data.numero_pregunta,
          totalPreguntas: data.total_preguntas,
        });
      else if (endpoint === "/chatbot/responder") {
        if (data.completado) setChatState({ step: "completado" });
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: generateUniqueId(),
          text: "❌ Error de conexión. Intenta nuevamente.",
          sender: "bot",
          type: "error",
        },
      ]);
    }
  };

  const seleccionarOpcion = (opcion: string) => {
    setInput(opcion);
    setTimeout(() => enviarMensaje(), 100);
  };

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const getMessageStyle = (message: Message) => {
    const base = { borderRadius: 18, padding: 12, marginVertical: 4, marginHorizontal: 8, maxWidth: width * 0.8 };
    if (message.sender === "user") return { ...base, backgroundColor: "#6366F1", borderBottomRightRadius: 6, alignSelf: "flex-end" };
    if (message.type === "error") return { ...base, backgroundColor: "#EF4444", alignSelf: "flex-start", borderBottomLeftRadius: 6 };
    if (message.type === "question") return { ...base, backgroundColor: "#8B5CF6", alignSelf: "flex-start", borderBottomLeftRadius: 6 };
    return { ...base, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E7EB", alignSelf: "flex-start", borderBottomLeftRadius: 6 };
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, backgroundColor: "#F0F9FF" }}>
        <View style={{ backgroundColor: "#6366F1", paddingTop: Platform.OS === "ios" ? 50 : 10, paddingBottom: 10, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
            <TouchableOpacity onPress={onClose}><Ionicons name="arrow-back" size={22} color="#FFF" /></TouchableOpacity>
            <Animated.View style={{ marginLeft: 10, transform: [{ scale: pulseAnim }], width: 36, height: 36, borderRadius: 18, backgroundColor: "#FFF", justifyContent: "center", alignItems: "center" }}>
              <FontAwesome5 name="robot" size={18} color="#6366F1" />
            </Animated.View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "bold" }}>Amigo Matemático</Text>
              <Text style={{ color: "#E0E7FF", fontSize: 12 }}>
                {chatState.tema ? `Tema: ${chatState.tema}` : "Aprendiendo juntos"}
                {chatState.numeroPregunta && ` • ${chatState.numeroPregunta}/${chatState.totalPreguntas}`}
              </Text>
            </View>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={getMessageStyle(item)}>
              <Text style={{ color: item.sender === "user" ? "#FFF" : "#000", fontSize: 16 }}>{item.text}</Text>
              {item.options?.map((opcion, idx) => (
                <TouchableOpacity key={idx} onPress={() => seleccionarOpcion(opcion)} style={{ backgroundColor: "#8B5CF6", padding: 8, borderRadius: 10, marginTop: 5 }}>
                  <Text style={{ color: "#FFF", textAlign: "center" }}>{opcion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingVertical: 10 }}
          showsVerticalScrollIndicator={false}
        />

        <View style={{ padding: 12, borderTopWidth: 1, borderColor: "#E5E7EB", backgroundColor: "#FFF" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              style={{ flex: 1, borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, marginRight: 10, backgroundColor: "#F9FAFB", fontSize: 15 }}
              value={input}
              onChangeText={setInput}
              placeholder="Escribe tu respuesta..."
              placeholderTextColor="#9CA3AF"
              onSubmitEditing={enviarMensaje}
            />
            <TouchableOpacity onPress={enviarMensaje} style={{ backgroundColor: "#10B981", width: 44, height: 44, borderRadius: 22, justifyContent: "center", alignItems: "center" }}>
              <Ionicons name="send" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ChatBot;
