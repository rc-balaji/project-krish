import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import Voice from '@react-native-voice/voice';
import axios from 'axios';

const VoiceControl = () => {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [status, setStatus] = useState('OFF');

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const handleVoiceCommand = (command) => {
    setStatus(command);
    axios.post('https://project-krish.onrender.com/publish', { status: command })
      .then(response => {
        console.log('Message sent:', response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const onSpeechResults = (e) => {
    console.log('onSpeechResults:', e.value);
    const command = e.value?.[0]?.toLowerCase();
    setRecognizedText(e.value?.[0] ?? '');

    switch (true) {
      case command.includes('on'):
        handleVoiceCommand('ON');
        break;
      case command.includes('of'):
        handleVoiceCommand('OFF');
        break;
      case command.includes('up'):
        handleVoiceCommand('UP');
        break;
      case command.includes('down'):
        handleVoiceCommand('DOWN');
        break;
      case command.includes('left'):
        handleVoiceCommand('LEFT');
        break;
      case command.includes('right'):
        handleVoiceCommand('RIGHT');
        break;
      default:
        // Handle unknown command
        console.log('Unknown command:', command);
    }
    setIsListening(false);
  };

  const handleLongPress = (event) => {
    event.persist();
    setIsListening(true);
    Voice.start('en-US');
  };

  const handlePressOut = () => {
    Voice.stop();
    setIsListening(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Voice Control</Text>
      <Text style={styles.statusText}>Status: {status}</Text>
      <Text style={styles.recognizedText}>Recognized Text: {recognizedText}</Text>
      <TouchableOpacity
        style={styles.button}
        onLongPress={handleLongPress}
        onPressOut={handlePressOut}
        delayLongPress={250}
      >
        {isListening ? (
          <ActivityIndicator size="large" color="#FFFFFF" />
        ) : (
          <Image source={require('./images/mic.png')} style={styles.micIcon} />
        )}
      </TouchableOpacity>
      {isListening && <Text style={styles.listeningText}>Listening...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 18,
    marginVertical: 10,
  },
  recognizedText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333333',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 100,
  },
  listeningText: {
    marginTop: 20,
    fontSize: 16,
    color: '#007AFF',
  },
  micIcon: {
    width: 50,
    height: 50,
  },
});

export default VoiceControl;
