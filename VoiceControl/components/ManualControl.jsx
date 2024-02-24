import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';

const ManualControl = () => {
  const [status, setStatus] = useState('OFF');

  const sendCommand = (command) => {
    setStatus(command); // This will set the status to either 'ON', 'OFF', or any of the directional commands
    axios.post('https://project-krish.onrender.com/publish', { status: command })
      .then(response => {
        console.log('Command sent:', response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const getCenterImage = () => {
    // Conditionally set the center image based on the status
    if (status === 'ON') {
      return require('./images/centerOn.png'); // Path to the 'ON' state image
    } else if (status === 'OFF') {
      return require('./images/centerOff.png'); // Path to the 'OFF' state image
    }else{
        return require('./images/centerOff.png'); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Controller</Text>
      <View style={styles.directionContainer}>
        <TouchableOpacity style={styles.directionButton} onPress={() => sendCommand('UP')}>
          <Image source={require('./images/up.png')} style={styles.icon} />
        </TouchableOpacity>
        <View style={styles.horizontal}>
          <TouchableOpacity style={styles.directionButton} onPress={() => sendCommand('LEFT')}>
            <Image source={require('./images/left.png')} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.centerButton} onPress={() => sendCommand('CENTER')}>
            <Image source={getCenterImage()} style={styles.centerButton} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.directionButton} onPress={() => sendCommand('RIGHT')}>
            <Image source={require('./images/right.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.directionButton} onPress={() => sendCommand('DOWN')}>
          <Image source={require('./images/down.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.onOffContainer}>
        <TouchableOpacity style={[styles.onOffButton, styles.onButton]} onPress={() => sendCommand('ON')}>
          <Text style={styles.buttonText}>ON</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.onOffButton, styles.offButton]} onPress={() => sendCommand('OFF')}>
          <Text style={styles.buttonText}>OFF</Text>
        </TouchableOpacity>
      </View>
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
    directionContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    horizontal: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    directionButton: {
      margin: 10,
      padding: 20,
      borderRadius: 10,
    },
    centerButton: {
      margin: 10,
      width: 70, // Set the width of the button
      height: 70, // Set the height of the button
      borderRadius: 35, // This will make it perfectly round. Adjust this value if you change the size.
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#007AFF', // Optional: change the background color of the button
    },
    onOffContainer: {
      flexDirection: 'row',
      marginTop: 20,
    },
    onOffButton: {
      padding: 20,
      borderRadius: 10,
      margin: 10,
    },
    onButton: {
      backgroundColor: 'green',
    },
    offButton: {
      backgroundColor: 'red',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
    },
    icon: {
      width: 50, // Adjust if necessary to fit the button
      height: 50, // Adjust if necessary to fit the button
    },
  });
  

export default ManualControl;
