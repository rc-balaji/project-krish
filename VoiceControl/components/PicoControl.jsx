import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, Image } from 'react-native';
import TcpSocket from 'react-native-tcp-socket';

const ManualControl = () => {
  const [client, setClient] = useState(null);
  const [serverIp, setServerIp] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    return () => {
      if (client) {
        client.destroy();
        setClient(null);
        setIsConnected(false);
      }
    };
  }, [client]);

  const connectToServer = () => {
    if (serverIp) {
      const newClient = TcpSocket.createConnection({
        host: serverIp,
        port: 80,
      }, () => {
        console.log('Connected to server');
        setIsConnected(true);
      });

      newClient.on('error', (error) => {
        console.error('Connection Error:', error);
        setIsConnected(false);
      });

      newClient.on('close', () => {
        console.log('Connection closed');
        setIsConnected(false);
      });

      setClient(newClient);
    }
  };

  const disconnectFromServer = () => {
    if (client) {
      client.destroy();
      setClient(null);
      setIsConnected(false);
    }
  };

  const sendCommand = (command) => {
    const commandMap = {
      'UP': 'F',
      'DOWN': 'B',
      'LEFT': 'L',
      'RIGHT': 'R',
      'CENTER': 'S',
    };

    const tcpCommand = commandMap[command];
    if (tcpCommand && client) {
      client.write(tcpCommand);
      console.log('Command sent:', tcpCommand);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manual Control</Text>
      {!isConnected ? (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Enter Server IP"
            value={serverIp}
            onChangeText={setServerIp}
          />
          <Button title="Connect" onPress={connectToServer} />
        </View>
      ) : (
        <>
          <Button title="Disconnect" onPress={disconnectFromServer} color="red" />
          <View style={styles.directionContainer}>
            <TouchableOpacity style={styles.directionButton} onPress={() => sendCommand('UP')}>
              <Image source={require('./images/up.png')} style={styles.icon} />
            </TouchableOpacity>
            <View style={styles.horizontal}>
              <TouchableOpacity style={styles.directionButton} onPress={() => sendCommand('LEFT')}>
                <Image source={require('./images/left.png')} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.centerButton} onPress={() => sendCommand('CENTER')}>
                <Image source={require('./images/centerOff.png')} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.directionButton} onPress={() => sendCommand('RIGHT')}>
                <Image source={require('./images/right.png')} style={styles.icon} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.directionButton} onPress={() => sendCommand('DOWN')}>
              <Image source={require('./images/down.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
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
  icon: {
    width: 50,
    height: 50,
  },
});

export default ManualControl;
