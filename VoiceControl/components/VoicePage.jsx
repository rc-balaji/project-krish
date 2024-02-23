import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Voice from '@react-native-voice/voice';

const App = () => {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const handleVoiceCommand = (status) => {
    axios.post('http://localhost:3001/publish', { status })
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
    if (command.includes('on')) {
      handleVoiceCommand('ON');
    } else if (command.includes('off')) {
      handleVoiceCommand('OFF');
    }
    setIsListening(false);
  };

  const startListening = async () => {
    setIsListening(true);
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error('Error starting voice recognition:', e);
      setIsListening(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPressIn={startListening} onPressOut={() => Voice.stop()}>
        <Text style={styles.buttonText}>{isListening ? 'Listening...' : 'Press and Hold to Talk'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default App;
