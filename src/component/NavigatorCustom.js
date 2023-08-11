import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ListPage from './../page/ListPage';
import ListKeranjang from './../page/ListKeranjang';
import ListPrint from './../page/ListPrint';
import { css_global } from './../style/StyleGlobal';
import BlueTootPage from './../page/BlueTootPage';
import Acount from './../page/Acount';

const bottomTap =  createBottomTabNavigator();
export default function NavigatorCustom() {
    return(
        <bottomTap.Navigator
        screenOptions={{
            tabBarShowLabel:false,
            tabBarStyle: { 
                position: 'absolute',
                bottom : 25,
                left:20,
                right:20,
                elevation:0,
                backgroundColor: '#ffff',
                borderRadius: 15,
                height: 80 
            },
            tabBarHideOnKeyboard:true
        }}
        >
            <bottomTap.Screen name="bluetooth" component={BlueTootPage} options={{
                headerShown: false,
                tabBarIcon:({focused})=>(
                    <View>
                        <Image 
                        source={require('../img/bluetooth.png')} 
                        resizeMode="contain"
                        style={{
                            left:14,
                            width:25,
                            height:25,
                            tintColor: focused ? 'red' : 'black'
                        }}
                        />
                        <Text style={focused ? css_global.textTapOn : css_global.textTapOff }>Bluetooth</Text>
                    </View>
                )
            }}/>
            <bottomTap.Screen name="input" component={ListPage} options={{
                headerShown: false,
                tabBarIcon:({focused})=>(
                    <View>
                        <Image 
                        source={require('../img/input.png')} 
                        resizeMode="contain"
                        style={{
                            width:25,
                            height:25,
                            tintColor: focused ? 'red' : 'black'
                        }}
                        />
                        <Text style={focused ? css_global.textTapOn : css_global.textTapOff }>Input</Text>
                    </View>
                )
            }}/>
            <bottomTap.Screen name="keranjang" component={ListKeranjang} options={{
                headerShown: false,
                tabBarIcon:({focused})=>(
                    <View>
                        <Image 
                        source={require('../img/cart.png')} 
                        resizeMode="contain"
                        style={{
                            width:25,
                            height:25,
                            tintColor: focused ? 'red' : 'black'
                        }}
                        />
                        <Text style={focused ? css_global.textTapOn : css_global.textTapOff }>Cart</Text>
                    </View>
                )
            }}/>
            <bottomTap.Screen name="cetak" component={ListPrint} options={{
                headerShown: false,
                tabBarIcon:({focused})=>(
                    <View>
                        <Image 
                        source={require('../img/print.png')} 
                        resizeMode="contain"
                        style={{
                            width:25,
                            height:25,
                            tintColor: focused ? 'red' : 'black'
                        }}
                        />
                        <Text style={focused ? css_global.textTapOn : css_global.textTapOff }>Print</Text>
                    </View>
                )
                }}/>
            <bottomTap.Screen name="akun" component={Acount} options={{
            headerShown: false,
            tabBarIcon:({focused})=>(
                <View>
                    <Image 
                    source={require('../img/acount.png')} 
                    resizeMode="contain"
                    style={{
                        width:25,
                        height:25,
                        tintColor: focused ? 'red' : 'black'
                    }}
                    />
                    <Text style={{...focused ? css_global.textTapOn : css_global.textTapOff
                    }}>Akun</Text>
                </View>
            )
            }}/>
        </bottomTap.Navigator>
      )
}

const styles = StyleSheet.create({
    shadow:{
        shadowColor:'#7f5df0',
        shadowOffset:{
            width:0,
            height:10
        },
        shadowOpacity: 0.26,
        shadowRadius: 3.5,
        elevation:5
    }
})