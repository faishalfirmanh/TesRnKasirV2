import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, {useEffect} from 'react'
import { height_device, css_global } from '../style/StyleGlobal'


export default function ButtonCustom({
        mLeft,
        mTop,
        text, 
        btnOnSubmitProps,
        isSuccess, 
        widthCusBtn, 
        heightBtnPercentDevice,
        f_size}) {
const persent_h = heightBtnPercentDevice != undefined  ? heightBtnPercentDevice : 7;
const font_size_fix = f_size != undefined ? f_size : 21;
const height_btn = (persent_h / 100) * height_device
 useEffect(() => {
    // console.log(btnOnSubmitProps);
    console.log('he',persent_h);
 }, [])
 

  return (
    <View style={{marginLeft:mLeft,marginTop:mTop}}>
      <TouchableOpacity 
            onPress={btnOnSubmitProps}
            style={{
                backgroundColor:'white',
                width:widthCusBtn ? widthCusBtn : 'auto',
                height: height_btn,
                borderRadius:7,
                borderWidth:1,
                borderColor: isSuccess ? 'green' : 'red',
                ...css_global.centerItemButton
            }}>
          <Text style={{
                fontSize:font_size_fix,
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
     
        // borderColor: isSuccess ? 'green' : 'red',
   }
});