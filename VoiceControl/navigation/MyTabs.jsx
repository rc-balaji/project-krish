import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import VoiceControl from '../components/VoiceControl'; // Update the path as necessary
import ManualControl from '../components/ManualControl'; // Update the path as necessary
import { Image } from 'react-native';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let ImageSrc;
          
            if (route.name === 'VoiceControl') {
              ImageSrc = focused
                ? require('./activevoice.png') // path to your focused icon
                : require('./inactivevoice.png'); // path to your unfocused icon
            } else if (route.name === 'ManualControl') {
              ImageSrc = focused
                ? require('./activecontroller.png') // path to your focused icon
                : require('./inactivecontroller.png'); // path to your unfocused icon
            }
          
            // You can return any component that you like here!
            return <Image source={ImageSrc} style={{ width: size, height: size }} />;
          },
          
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="VoiceControl" component={VoiceControl} />
      <Tab.Screen name="ManualControl" component={ManualControl} />
    </Tab.Navigator>
  );
}

export default MyTabs;
