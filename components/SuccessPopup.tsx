import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from "react-native";
import defaultSuccessIcon from "../assets/images/success.png";

type SuccessPopupProps = {
  visible: boolean;
  onClose: () => void;
  message: string;
  icon?: ImageSourcePropType;
};

const SuccessPopup: React.FC<SuccessPopupProps> = ({
  visible,
  onClose,
  message,
  icon,
}) => {
  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Image source={icon || defaultSuccessIcon} style={styles.icon} />
          <Text style={styles.text}>{message}</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClose}
            style={styles.buttonWrapper}
          >
            <LinearGradient
              colors={["#ff6f61", "#d72638"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>OK</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  popup: {
    width: 320,
    padding: 25,
    backgroundColor: "#000428",
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8.3,
    elevation: 13,
  },
  text: {
    fontSize: 18,
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Poppins-Bold",
  },
  buttonWrapper: {
    width: "60%",
  },
  buttonGradient: {
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8.3,
    elevation: 13,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 20,
    resizeMode: "contain",
  },
});

export default SuccessPopup;
