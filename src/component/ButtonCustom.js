import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, {useEffect} from 'react'
import { height_device } from '../style/StyleGlobal'

const height_btn = (7 / 100) * height_device
export default function ButtonCustom({mLeft,text, btnOnSubmitProps,isSuccess, widthCusBtn}) {

 useEffect(() => {
    // console.log(btnOnSubmitProps);
 }, [])
 

  return (
    <View style={{marginLeft:mLeft}}>
      <TouchableOpacity 
            onPress={btnOnSubmitProps}
            style={{
                backgroundColor:'white',
                width:widthCusBtn ? widthCusBtn : 'auto',
                height: height_btn,
                borderRadius:7,
                borderWidth:1,
                borderColor: isSuccess ? 'green' : 'red',
            }}>
          <Text style={{
                fontSize:21,
                marginTop:10,
                margin:12,
                color:  isSuccess ? 'green' : 'red',
                fontWeight:'500'
            }}>
            {text}
          </Text>
      </TouchableOpacity>  
    </View>
  )

  
}

const styles = StyleSheet.create({
   style_text_btn :{
    
   },
   style_wrap_btn :{
        backgroundColor:'white',
        height: height_btn,
        borderRadius:7,
        borderWidth:1,
        // borderColor: isSuccess ? 'green' : 'red',
   }
});