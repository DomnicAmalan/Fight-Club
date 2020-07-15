/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { useEffect, useState, createContext } from 'react';
import 'react-native-gesture-handler'

import AuthRoute from './components/AuthComponent'
import AppComponent from './components/AppComponent'
import AsyncStorage from '@react-native-community/async-storage';
import { UserProvider } from './contexts/context'

const App: () => React$Node = () => {

  const [isLoggedIn, setLogin] = useState(false);
  const [loginType, setLoginType] = useState(null);
  const [identifier, setIdentifier] = useState(null);

  

  return (
    <>
      <UserProvider value={setLogin}>
        {
          isLoggedIn ?  <AppComponent /> : <AuthRoute />
        }
      </UserProvider>
    </>
    
  );
};

export default App;
