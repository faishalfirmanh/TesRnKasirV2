import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { css_global, height_device, width_device } from './../style/StyleGlobal';

export default function ComponentTextInput({functioOnChangeCustom, tipeKeyboardProps, can_edit}) {
  return (
    <View>
        <TextInput 
            onChangeText={functioOnChangeCustom}
            editable={can_edit}
            keyboardType={tipeKeyboardProps}
            style={css_global.textInputStyle}>
        </TextInput>
    </View>
  )
}