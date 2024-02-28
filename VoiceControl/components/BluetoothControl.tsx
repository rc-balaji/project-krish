import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
  FlatList,
  TouchableHighlight,
  Pressable,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import BleManager from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const App = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [peripherals, setPeripherals] = useState(new Map());

  const startScan = () => {
    if (!isScanning) {
      setPeripherals(new Map());
      setIsScanning(true);
      BleManager.scan([], 3, true).then(() => {
        console.debug('Scanning...');
      });
    }
  };

  const handleStopScan = () => {
    setIsScanning(false);
    console.debug('Scan is stopped');
  };

  const handleDisconnectedPeripheral = data => {
    let p = peripherals.get(data.peripheral);
    if (p) {
      p.connected = false;
      setPeripherals(new Map(peripherals.set(data.peripheral, p)));
    }
  };

  const handleDiscoverPeripheral = peripheral => {
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    setPeripherals(new Map(peripherals.set(peripheral.id, peripheral)));
  };

  const handleUpdateValueForCharacteristic = data => {
    console.debug('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
  };

  useEffect(() => {
    BleManager.start({showAlert: false});

    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
    bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
    bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral);
    bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(result => {
        if (!result) {
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        }
      });
    }

    return () => {
      console.debug('App unmounted');
    };
  }, []);

  const renderItem = item => {
    return (
      <TouchableHighlight onPress={() => {}}>
        <View style={styles.row}>
          <Text style={styles.peripheralName}>{item.item.name}</Text>
          <Text style={styles.peripheralId}>{item.item.id}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  return (
    <>
      <StatusBar />
      <SafeAreaView style={styles.body}>
        <Pressable style={styles.scanButton} onPress={startScan}>
          <Text style={styles.scanButtonText}>{isScanning ? 'Scanning...' : 'Scan Bluetooth'}</Text>
        </Pressable>
        <FlatList
          data={Array.from(peripherals.values())}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  scanButton: {
    margin: 10,
    padding: 10,
    backgroundColor: '#007bff',
  },
  scanButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 20,
  },
  row: {
    margin: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  peripheralName: {
    fontSize: 18,
  },
  peripheralId: {
    fontSize: 14,
    color: '#999999',
  },
});

export default App;
