import { View, Text, StyleSheet,
FlatList,
TouchableOpacity,
ActivityIndicator } from 'react-native'
import React, {useContext, useState, useEffect} from 'react'
import { AppContext } from './../context/AppContext';
import InputSearch from './../component/InputSearch';
import ListProduct from './../component/ListProduct';

export default function Home({navigation}) {
  const contexst = useContext(AppContext)
  
  return (
    <View style={{backgroundColor:'#AAB9A8'}}>
      <Text>Home</Text>
      <InputSearch label={"input product"} value={3} type="search"/>
      <TouchableOpacity style={css.cusButton} onPress={()=>  navigation.navigate('listtab')}>
        <Text>go to list </Text>
      </TouchableOpacity>
    </View>
  )
}

const css = StyleSheet.create({
  cusButton:{
    backgroundColor:"#329a",
    color:'white',
    padding:10,
    width: 140,
    borderRadius:8,
  
  }
})