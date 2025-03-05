import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "../context/ThemeContext";

const CustomDateTimePicker = ({ date, onDateChange }) => {
  const { theme } = useTheme();
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    if (selectedDate) {
      console.log("Data antes da conversão:", selectedDate);
      const adjustedDate = new Date(
        selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
      );
      console.log("Data ajustada:", adjustedDate);
      onDateChange(adjustedDate);
    }
    setShow(false);
  };

  const formatDate = (date) => {
    if (!date) return "Definir data";
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>
        Data de Vencimento
      </Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.card }]}
        onPress={() => setShow(true)}
      >
        <Icon name="event" size={24} color={theme.primary} />
        <Text style={[styles.buttonText, { color: theme.text }]}>
          {formatDate(date)}
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display="default"
          onChange={onChange}
          minimumDate={new Date()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
  },
});

export default CustomDateTimePicker;
