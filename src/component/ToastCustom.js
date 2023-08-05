import { View, Text,TextInput, StyleSheet, ToastAndroid } from 'react-native'
import React from 'react'

export const custom_toast = (value) => {
    return (
        ToastAndroid.showWithGravity(
            `${value}`,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
        )
    )
}