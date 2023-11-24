import { View, Text, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native'
import React, {useState, useContext, useEffect} from 'react'
import { css_global } from './../style/StyleGlobal';
import { AppContext } from './../context/AppContext';
import axios from 'axios';
import url from './../endpoint/Endpoint';
import { custom_toast } from './../component/ToastCustom';
import { ReqApiAxios, RequestApiPostGenerate } from './../endpoint/RequestApi';
import ButtonCustom from '../component/ButtonCustom';
import AsyncStorage from '@react-native-community/async-storage';

export default function Acount({navigation}) {
    const global_state = useContext(AppContext);
    //const token_ =  global_state.userLogin.jwt_token ?  global_state.userLogin.jwt_token :  global_state.userLogin.data_api.jwt_token//global_state.userLogin.data_api.jwt_token;
    const [isLoading, setLoading] = useState(true);
    const [tokenStor, setTokenStore] = useState('');
    

    useEffect(() => {
      const getKeyFunction = async()=>{
         try {
            let keyStorage = await AsyncStorage.getItem('keyLogin');
            let storage_user = await AsyncStorage.getItem('userLogin');
            console.log('account',keyStorage);
            if(keyStorage == null) {
              navigation.navigate('login')
            }else if (storage_user == null) {
              navigation.navigate('login')
            }else{
              setTokenStore(keyStorage);
            }
           
          } catch (error) {
            console.error('Error retrieving data from AsyncStorage:', error);
          }
      }
       getKeyFunction()
    },[])

  const logout = async () =>{
     const url_logout = `${url.end_point_dev}${url.logout}`
   //   const headers_config = { headers: {"Authorization" : `Bearer ${token_}`}};

     try {
        const reqapi = await RequestApiPostGenerate(url_logout,tokenStor)
        if (reqapi.status == 200) {
            custom_toast("Logout berhasil tunggu sebentar")
            await AsyncStorage.setItem('userLogin','null');//kalau tidak diset string null, di lempar ke catch
            await AsyncStorage.setItem('keyLogin','null');
            global_state.setUserLogin(null);
            setTimeout(() => {
                navigation.navigate('login')
            }, 2000);
        }
     } catch (error) {
        console.log('error logout',error);
        custom_toast("Logout gagal")
     }
  }

  return (
    <View style={{ flex: 1,justifyContent: 'center', alignItems: 'center'}}>
       <ButtonCustom
        widthCusBtn={90}
        heightBtnPercentDevice={5}
        text={"Logout"} 
        isSuccess={false} 
        btnOnSubmitProps={() => logout()}
       />
    </View>
  )
}