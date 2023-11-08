
import { StyleSheet, Dimensions } from 'react-native';

export const width_device = Dimensions.get('window').width;
export const height_device = Dimensions.get('window').height;

export const css_global = StyleSheet.create({
    textInputStyle:{
        height: 45,
        margin: 12,
        borderWidth: 1.5,
        borderRadius:4,
        color:'black',
        backgroundColor:'white',
        paddingLeft:10
    },
    buttonStyle:{
        marginLeft:12,
        borderRadius:13,
        textAlign:'center',
        width:100,
        height:40,
        backgroundColor:'red',
        marginBottom:10
    },
    textStyle :{
        color:'black',
        fontSize: 16,
        marginLeft:12
    },
    textStyleButton:{
        fontSize:14,
        color:'white',
        textAlign: 'center',
        top:7
    },
    textTapOff:{
        color:'black',
        fontSize:12,
    },
    textTapOn:{
        color:'red',
        fontSize:12,
    },
    icon_tab:{
      
    }
    ,
    borderRed :{
        borderColor:'red'
    },
    borderBlack :{
        borderColor:'black',
    },
    centerItemButton:{
        justifyContent: "center",
        alignItems: "center",
    }
})