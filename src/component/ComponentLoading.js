import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'

export default function ComponentLoading() {
  return (
    <ActivityIndicator size="large" style={{ marginTop:19,transform: [{ scaleX: 2 }, { scaleY: 2 }] }}/>
  )
}