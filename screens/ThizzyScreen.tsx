import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import * as Animatable from "react-native-animatable";

// ✅ Interface for message structure
interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

const ThizzyScreen = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://192.168.8.140:5005/webhooks/rest/webhook",
        {
          sender: "user",
          message: input,
        }
      );

      if (response.data.length > 0) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.data[0].text,
          sender: "bot",
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Chatbot error:", error);
    }

    setLoading(false);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === "user";

    return (
      <Animatable.View
        animation={isUser ? "slideInRight" : "slideInLeft"}
        duration={500}
        style={[
          styles.messageWrapper,
          isUser ? styles.userWrapper : styles.botWrapper,
        ]}
      >
        {/* Bot icon for bot messages */}
        {!isUser && (
          <Animatable.Image
            animation="pulse" // Pulse animation for the bot icon
            iterationCount="infinite"
            duration={1500}
            easing="ease-in-out"
            source={require("../assets/images/animated_chatbot.gif")}
            style={[styles.botIcon, { transform: [{ scale: 1.2 }] }]} // Increase the icon size slightly
          />
        )}

        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.botBubble,
          ]}
        >
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      </Animatable.View>
    );
  };

  return (
    <LinearGradient
      colors={["#000428", "#004e92"]}
      style={styles.gradientContainer}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <Text style={styles.title}>Chat with Thizzy</Text>

        <FlatList
          data={messages.reverse()}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatContainer}
          inverted
        />

        {/* Loading Spinner for bot reply */}
        {loading && (
          <View style={styles.loadingContainer}>
            <Animatable.Image
              animation="rotate"
              iterationCount="infinite"
              duration={1000}
              easing="linear"
              source={require("../assets/images/loading.png")} // 👈 Replace with your cogwheel icon
              style={styles.loadingIcon}
            />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        )}

        {/* Input Field */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#ccc"
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <LinearGradient
              colors={["#ff6f61", "#d72638"]}
              style={styles.sendButtonGradient}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={() => navigation.goBack()}
        >
          <LinearGradient
            colors={["#ff6f61", "#d72638"]}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Back to Menu</Text>
          </LinearGradient>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default ThizzyScreen;

// ✅ Styles
const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Poppins-Bold",
  },
  chatContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingBottom: 10,
  },
  messageWrapper: {
    flexDirection: "row",
    marginVertical: 5,
    alignItems: "flex-end",
  },
  userWrapper: {
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },
  botWrapper: {
    justifyContent: "flex-start",
    alignSelf: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  userBubble: {
    backgroundColor: "#ff6f61",
    borderTopRightRadius: 0,
  },
  botBubble: {
    backgroundColor: "#ffffff20",
    borderTopLeftRadius: 0,
    borderWidth: 1,
    borderColor: "#ffffff30",
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  botIcon: {
    width: 50,
    height: 30,
    marginRight: 10,
    marginBottom:30
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  loadingIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  loadingText: {
    color: "#fff",
    fontFamily: "Poppins-Regular",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#ffffff20",
    borderRadius: 30,
    color: "#fff",
    fontFamily: "Poppins-Regular",
    borderWidth: 1,
    borderColor: "#ffffff30",
  },
  sendButton: {
    marginLeft: 10,
  },
  sendButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#fff",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  backButtonContainer: {
    width: "100%",
  },
  backButton: {
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
});
