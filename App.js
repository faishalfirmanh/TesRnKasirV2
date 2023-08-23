/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import Login from './src/page/Login';
import ListPage from './src/page/ListPage';
import ListKeranjang from './src/page/ListKeranjang';
import ListPrint from './src/page/ListPrint';
import BlueTootPage from './src/page/BlueTootPage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppContext } from './src/context/AppContext';


import NavigatorCustom from './src/component/NavigatorCustom';
import {
  StyleSheet,
  LogBox
} from 'react-native';


const Stack = createNativeStackNavigator();

const App = () => {

  const [user, setUser] = useState({})
  const [userLogin, setUserLogin] = useState({})
  const [product, setProduct] = useState({});
  const [dataBlueTooth, setDataBlueTooth] = useState({});
  const [dataListcBlueToothConnect, setListBlueToothConnect] = useState({});

  useEffect(() => {
    const user = {
       name : 'zlatan',
       image : 'https://awsimages.detik.net.id/community/media/visual/2023/06/05/zlatan-ibrahimovic-4_169.jpeg?w=600&q=90'
    }
    console.log("app",userLogin);
  }, [])

  	
  LogBox.ignoreLogs(['Remote debugger']);
  const appContextValue = {
    user,
    setUser,
    userLogin,
    setUserLogin,
    product,
    setProduct,
    dataBlueTooth,
    setDataBlueTooth,
    setListBlueToothConnect,
    dataListcBlueToothConnect
  }

  const bottomTap =  createBottomTabNavigator();

  function Tablist() {
    return(
      <bottomTap.Navigator>
          <bottomTap.Screen name="listBluetooth" component={BlueTootPage} options={{headerShown: false}}/>
          <bottomTap.Screen name="listInput" component={ListPage} options={{headerShown: false}}/>
          <bottomTap.Screen name="listKeranjang" component={ListKeranjang} options={{headerShown: false}}/>
          <bottomTap.Screen name="listPrint" component={ListPrint} options={{headerShown: false}}/>
      </bottomTap.Navigator>
    )
  }
  
  return (
    <AppContext.Provider value={appContextValue}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="login" component={Login} options={{headerShown: false}}/>
          {/* <Stack.Screen name="home" component={Home} /> */}
          <Stack.Screen name="menu" component={NavigatorCustom} />
          <Stack.Screen name="listPrint" component={ListPrint}/>
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: "white",
    flex:1
  }
});

export default App;
