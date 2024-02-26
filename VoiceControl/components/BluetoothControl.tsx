import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import { BleManagerDiscoverPeripheralEvent, Peripheral } from 'react-native-ble-manager';
import { NativeEventEmitter, NativeModules } from 'react-native';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const Bluetooth: React.FC = () => {
  const [peripherals, setPeripherals] = useState<Map<string, Peripheral>>(new Map());
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    BleManager.start({ showAlert: false });

    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
        if (result) {
          console.log('Permission is OK');
        } else {
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
            if (result) {
              console.log('User accept');
            } else {
              console.log('User refuse');
            }
          });
        }
      });
    }

    return () => {
      console.log('Unmount');
      // Remove all listeners
      bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
    };
  }, []);

  const handleDiscoverPeripheral = (peripheral: BleManagerDiscoverPeripheralEvent) => {
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    setPeripherals((currentPeripherals) => {
      const newPeripherals = new Map(currentPeripherals);
      newPeripherals.set(peripheral.id, peripheral);
      return newPeripherals;
    });
  };

  const startScan = () => {
    if (!isScanning) {
      BleManager.scan([], 5, true).then(() => {
        console.log('Scanning...');
        setIsScanning(true);
      });
    }
  };

  const handleStopScan = () => {
    console.log('Scan is stopped');
    setIsScanning(false);
  };

  useEffect(() => {
    bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);

    return () => {
      bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan);
    };
  }, []);

  const renderItem = (item: Peripheral) => {
    return (
      <TouchableOpacity onPress={() => testPeripheral(item)}>
        <View style={styles.row}>
          <Text style={styles.text}>{item.name}</Text>
          <Text style={styles.textSmall}>{item.id}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const testPeripheral = (peripheral: Peripheral) => {
    if (peripheral) {
      if (peripheral.connected) {
        BleManager.disconnect(peripheral.id);
      } else {
        BleManager.connect(peripheral.id)
          .then(() => {
            let p = peripherals.get(peripheral.id);
            if (p) {
              p.connected = true;
              setPeripherals(new Map(peripherals.set(peripheral.id, p)));
              BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => {
                console.log(peripheralInfo);
                var service = '13333333-3333-3333-3333-333333333337';
                var bakeCharacteristic = '13333333-3333-3333-3333-333333330003';
                var crustCharacteristic = '13333333-3333-3333-3333-333333330001';

                setTimeout(() => {
                  BleManager.startNotification(peripheral.id, service, bakeCharacteristic).then(() => {
                    console.log('Started notification on ' + peripheral.id);
                    setTimeout(() => {
                      BleManager.write(peripheral.id, service, crustCharacteristic, [1]).then(() => {
                        console.log('Writed NORMAL crust');
                        BleManager.write(peripheral.id, service, bakeCharacteristic, [1, 95]).then(() => {
                          console.log('Writed 351 temperature, the pizza should be BAKED');
                        });
                      });
                    }, 500);
                  }).catch((error) => {
                    console.log('Notification error', error);
                  });
                }, 200);
              });
            }
          })
          .catch((error) => {
            console.log('Connection error', error);
          });
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => startScan()} style={styles.button}>
        <Text style={styles.buttonText}>Scan Bluetooth (BLE)</Text>
      </TouchableOpacity>
      <FlatList
        data={Array.from(peripherals.values())}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    width: '100%',
    padding: 10,
  },
  row: {
    margin: 10,
  },
  text: {
    fontSize: 12,
    textAlign: 'center',
  },
  textSmall: {
    fontSize: 10,
    textAlign: 'center',
  },
  button: {
    margin: 10,
    padding: 10,
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default Bluetooth;
