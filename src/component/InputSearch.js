import { View, Text,TextInput, StyleSheet } from 'react-native'
import React from 'react'

const InputSearch = ({label,value,type}) => {
  return (
    <View>
      <Text  style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder="input product name"
      />
    </View>
  )
}


const styles = StyleSheet.create({
    input: {
      height: 40,
      marginLeft: 12,
      borderWidth: 1,
      color:'black',
      backgroundColor:'yellow'
    },
    label :{
        color:'black',
        marginTop:10,
        marginLeft :15
     }
});



export default InputSearch