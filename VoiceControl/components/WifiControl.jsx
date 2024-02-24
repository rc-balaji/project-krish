import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import TcpSocket from 'react-native-tcp-socket';

const ManualControl = () => {
  const [status, setStatus] = useState('OFF');
  const serverIp = '192.168.251.39';
  const serverPort = 5000;

  const sendCommand = (command) => {
    setStatus(command);
    const client = TcpSocket.createConnection({ port: serverPort, host: serverIp }, () => {
      client.write(command);
    });

    client.on('data', (data) => {
      client.destroy();
    });

    client.on('error', (error) => {});

    client.on('close', () => {});
  };

  const getCenterImage = () => {
    if (status === 'ON') {
      return require('./images/centerOn.png');
    } else if (status === 'OFF') {
      return require('./images/centerOff.png');
    } else {
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
          <TouchableOpacity style={styles.centerButton} onPress={() => sendCommand(status === 'ON' ? 'OFF' : 'ON')}>
            <Image source={getCenterImage()} style={styles.centerIcon} />
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
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerIcon: {
    width: 50,
    height: 50,
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
    width: 50,
    height: 50,
  },
});

export default ManualControl;
