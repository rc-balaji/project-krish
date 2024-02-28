import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import VoiceControl from '../components/VoiceControl'; // Ensure this path is correct
import ManualControl from '../components/ManualControl'; // Ensure this path is correct
import WifiControl from '../components/PicoControl'; // Ensure this path is correct
import BluetoothControl from '../components/BluetoothControl'; // Import the BluetoothControl component, update the path as necessary
import { Image } from 'react-native';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
            let ImageSrc;
          
            if (route.name === 'VoiceControl') {
              ImageSrc = focused
                ? require('./activecontroller.png') // path to your focused icon
                : require('./inactivecontroller.png'); // path to your unfocused icon
            } else if (route.name === 'ManualControl') {
              ImageSrc = focused
                ? require('./activecontroller.png') // path to your focused icon
                : require('./inactivecontroller.png'); // path to your unfocused icon
            } else if (route.name === 'WifiControl') {
              ImageSrc = focused
                ? require('./activewifi.png') // Add your active wifi icon
                : require('./inactivewifi.png'); // Add your inactive wifi icon
            } else if (route.name === 'BluetoothControl') {
              ImageSrc = focused
                ? require('./activebluetooth.png') // Add your active Bluetooth icon
                : require('./inactivebluetooth.png'); // Add your inactive Bluetooth icon
            }
          
            // Returns the appropriate icon for each tab
            return <Image source={ImageSrc} style={{ width: size, height: size }} />;
          },
          
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="VoiceControl" component={VoiceControl} />
      <Tab.Screen name="ManualControl" component={ManualControl} />
      <Tab.Screen name="WifiControl" component={WifiControl} options={{ tabBarLabel: 'WiFi Control' }} />
      <Tab.Screen name="BluetoothControl" component={BluetoothControl} options={{ tabBarLabel: 'Bluetooth Control' }} />
    </Tab.Navigator>
  );
}

export default MyTabs;
