/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { useEffect, useState, createContext } from 'react';
import 'react-native-gesture-handler'
import {View, Text} from 'react-native'

import AuthRoute from './components/AuthComponent'
import DashboardScreen from './components/AppComponent'
import AsyncStorage from '@react-native-community/async-storage';
import { UserProvider } from './contexts/context'

const App: () => React$Node = (props) => {

  const [isLoggedIn, setLogin] = useState(false);
  const [uid, setUId] = useState(null)
  const [loginType, setLoginType] = useState(null);
  const [identifier, setIdentifier] = useState(null);
  const [isLoading, setLoading] = useState(true)
  
  useEffect(() => {    
    setTimeout(() => {
      setLoading(false)
    }, 2000, getInitialData())
    uid ? setLogin(true) : setLogin(false)
  })

  const getInitialData = () => {
    AsyncStorage.getItem('identifier').then(res =>{setIdentifier(res)})
    AsyncStorage.getItem('type').then(res =>{setLoginType(res)})
    AsyncStorage.getItem('uid').then(res =>{setUId(res)})
  }

  return (
    <UserProvider value={setLogin}>
      {props.children}
      {isLoading ? <View><Text>isLoading</Text></View> :
            isLoggedIn ?  <DashboardScreen /> : <AuthRoute setLogin={setLogin}/>
      }
    </UserProvider>
    
  );
};

export default App;
