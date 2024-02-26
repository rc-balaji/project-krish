import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, PermissionsAndroid, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const App = () => {
  const [scannedIp, setScannedIp] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [ipConfirmed, setIpConfirmed] = useState(false);
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    setIsSending(true);
    try {
      await axios.post(`http://${scannedIp}:8000/message`, { message });
      setMessage('');
      Alert.alert('Success', 'Message sent successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to send message to the server.');
    } finally {
      setIsSending(false);
    }
  };

  const sendCommand = async (command) => {
    setIsSending(true);
    try {
      await axios.post(`http://${scannedIp}:8000/command`, { command });
      Alert.alert('Success', `Command ${command} sent successfully.`);
    } catch (error) {
      Alert.alert('Error', 'Failed to send command to the server.');
    } finally {
      setIsSending(false);
    }
  };

  const confirmIp = () => {
    if (scannedIp) {
      setIpConfirmed(true);
    } else {
      Alert.alert('Error', 'Please enter a valid IP address.');
    }
  };

  if (isSending) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000FF" />
        <Text>Sending message...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>WIFI SCANNER</Text>
      {!ipConfirmed ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter IP address"
            placeholderTextColor="#000"
            value={scannedIp}
            onChangeText={setScannedIp}
            keyboardType="numeric"
          />
          <Button title="Confirm IP" onPress={confirmIp} />
        </View>
      ) : (
        <View style={styles.messageContainer}>
          <Text style={styles.ipText}>Current IP: {scannedIp}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your message"
            placeholderTextColor="#000"
            value={message}
            onChangeText={setMessage}
          />
          <Button title="Send Message" onPress={sendMessage} />
          <View style={styles.commandButtonsContainer}>
            {/* Command Buttons */}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    paddingTop: 20,
    paddingBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#FFF',
    color: '#000',
    marginBottom: 20,
    padding: 10,
    width: '80%',
    borderRadius: 5,
  },
  messageContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  ipText: {
    color: '#000',
    marginBottom: 15,
    fontSize: 16,
  },
  commandButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
  },
  commandButton: {
    margin: 5,
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    borderRadius: 5,
  },
});

export default App;
