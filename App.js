/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler'

import AuthRoute from './components/AuthComponent'
import AppComponent from './components/AppComponent'
import AsyncStorage from '@react-native-community/async-storage';

const App: () => React$Node = () => {

  const [isLoggedIn, setLogin] = useState(false);
  const [logginType, setLoginType] = useState(null);
  const [identifier, setIdentifier] = useState(null);

  return (
    <>
      {
        isLoggedIn ?  <AppComponent /> : <AuthRoute />
      }
    </>
    
  );
};

export default App;
