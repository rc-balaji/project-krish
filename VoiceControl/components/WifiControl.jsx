import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Image } from 'react-native';

const ManualControl = ({ serverIp }) => {
  const [status, setStatus] = useState('OFF');

  const sendCommand = (command) => {
    setStatus(command); // This sets the status to either 'ON' or 'OFF'
    axios.post(`http://${serverIp}:8000/publish`, { status: command })
      .then(response => {
        console.log('Command sent:', response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const toggleCenterButton = () => {
    const newStatus = status === 'OFF' ? 'ON' : 'OFF';
    sendCommand(newStatus);
  };

  const getCenterImage = () => {
    switch (status) {
      case 'ON':
        return require('./images/centerOn.png'); // Adjust the path as needed
      case 'OFF':
        return require('./images/centerOff.png'); // Adjust the path as needed
      default:
        return require('./images/centerOff.png'); // Default image or adjust as needed
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
          <TouchableOpacity style={styles.centerButton} onPress={toggleCenterButton}>
            <Image source={getCenterImage()} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.directionButton} onPress={() => sendCommand('RIGHT')}>
            <Image source={require('./images/right.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.directionButton} onPress={() => sendCommand('DOWN')}>
          <Image source={require('./images/down.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};


const WifiControl = () => {
  const [serverIp, setServerIp] = useState('');
  const [ipConfirmed, setIpConfirmed] = useState(false);

  const checkIpAvailability = async () => {
    if (!serverIp) {
      Alert.alert('Error', 'Please enter an IP address.');
      return;
    }
    try {
      const response = await axios.get(`http://${serverIp}:8000/check`);
      if (response.status === 200) {
        Alert.alert('Success', 'IP Available');
        setIpConfirmed(true);
      }
    } catch (error) {
      Alert.alert('Error', 'IP Not Available');
    }
  };

  const changeIp = () => {
    setIpConfirmed(false);
    setServerIp('');
  };

  return (
    <View style={styles.container}>
      {!ipConfirmed ? (
        <>
          <TextInput
            style={styles.input}
            onChangeText={setServerIp}
            value={serverIp}
            placeholder="Enter Server IP"
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.confirmButton} onPress={checkIpAvailability}>
            <Text style={styles.buttonText}>Check IP Availability</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text>Connected to: {serverIp}</Text>
          <TouchableOpacity style={styles.changeButton} onPress={changeIp}>
            <Text style={styles.buttonText}>Change IP</Text>
          </TouchableOpacity>
          <ManualControl serverIp={serverIp} />
        </>
      )}
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%',
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  changeButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
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
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
  },
  icon: {
    width: 50,
    height: 50,
  },
});

export default WifiControl;
