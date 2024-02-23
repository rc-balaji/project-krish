import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

// Import your tab navigator
import MyTabs from './navigation/MyTabs';

export default function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}
