import { View, Text, Button, StyleSheet, TextInput, ToastAndroid, Dimensions, TouchableOpacity, Image } from 'react-native'
import React,{useContext, useEffect, useState} from 'react'
import { AppContext } from './../context/AppContext';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import url from './../endpoint/Endpoint';
import { width_device } from '../style/StyleGlobal';
import ButtonCustom from '../component/ButtonCustom';
import { custom_toast } from '../component/ToastCustom';
import { setStorageKey } from '../component/HelperFunction';
import { getStorgaeKey } from '../component/HelperFunction';

export default function Login({navigation}) {

  const [emailParam, setEmail] = useState();
  const [pass, setPass] = useState('');
  const [securePass, setSecurePass] = useState(true);
    const contexst = useContext(AppContext)
  

    const AjaxLoginApi = (url,param)=>{
        return new Promise((resolve,reject)=>{
            axios.post(url, param)
              .then(function (response) {
                resolve(response);
              })
              .catch(function (error,param2) {
                reject(error,param2 );
              });
        })
    }

    useEffect(() => {
      const getKeyFunction = async()=>{
        try {
          let keyStorage = await AsyncStorage.getItem('keyLogin');
          let storage_user = await AsyncStorage.getItem('userLogin');
          console.log(JSON.parse(storage_user));
          
          if (keyStorage !== 'null') {
            navigation.navigate('menu')
          }
          contexst.setUserLogin(JSON.parse(storage_user))
        } catch (error) {
          console.error('Error retrieving data from AsyncStorage:', error);
          
        }
      }
      getKeyFunction()
    },[])
    

    //

    

    const submitToHomePage = async()=>{
        const email_user = emailParam;
        const pass_user = pass;
        console.log('ddd',emailParam);

        if (email_user == '' || pass_user == '' ) {
          return ToastAndroid.showWithGravity(
                  'Email dan password tidak boleh kosong',
                  ToastAndroid.SHORT,
                  ToastAndroid.CENTER
                );
        }
        if (email_user ==  undefined || pass_user == undefined ) {
          return ToastAndroid.showWithGravity(
                  'Email dan password tidak boleh kosong',
                  ToastAndroid.SHORT,
                  ToastAndroid.CENTER
                );
        }
      

        const url_api = `${url.end_point_dev}${url.url_login}`
        const sent_param = {
          email : email_user,
          password : pass_user
        }
        try {
          const result_api = await AjaxLoginApi(url_api,sent_param);
          const data_api = result_api.data;
          if(data_api.message == "success login"){
            contexst.setUserLogin({data_api});
            const jsonValue = JSON.stringify(data_api);
            await AsyncStorage.setItem('userLogin',`${jsonValue}`);
            console.log(jsonValue);
            console.log(data_api.jwt_token);
            setStorageKey(`${data_api.jwt_token}`)
            navigation.navigate('menu')
          }
          
          if (data_api.error) {
            setStorageKey('null')
              if (data_api.error.email) {
                custom_toast("Email tidak valid");
              }
          }
          // console.log(data_api);
        } catch (error) {
            let msg_error = error.response.data.message;
            setStorageKey(`null`)
            ToastAndroid.showWithGravity(
              msg_error,
              ToastAndroid.SHORT,
              ToastAndroid.CENTER
            );
        }
       
    }

    const showHidePass = ()=>{
        if(securePass){
          setSecurePass(false);
        }else{
          setSecurePass(true);
        }
    }

  return (
    <View style={{ flex: 1,justifyContent: 'center', alignItems: 'center'}}>
      
      <TextInput
        style={styles.input}
        placeholderTextColor="#B6BEAE" 
        placeholder="input email...."
        onChangeText={(input)=>setEmail(input)}
      />
    
      <View style={styles.btn_eye}>
          <TouchableOpacity onPress={()=> showHidePass()}>
              <Image 
                  source={securePass ? require('../img/hide.png') : require('../img/show.png')} 
                  resizeMode="contain"
                  style={{
                      marginLeft:8,
                      width:25,
                      height:25,
                  }}
              />
          </TouchableOpacity>
          <TextInput
            style={{height: 50, width: (65 / 100) * width_device,color:'black'}}
            placeholderTextColor="#B6BEAE" 
            placeholder="input password...."
            secureTextEntry={securePass}
            onChangeText={(input)=>setPass(input)}
          />
      </View>
      {/* <Button
        title="login"
        onPress={() => submitToHomePage()}
      /> */}
      {/* <Button title="Set state" onPress ={()=>contexst.setUser({name:'ini state'})}/> */}
      <ButtonCustom mTop={20} text={"Login"} isSuccess={true} btnOnSubmitProps={() => submitToHomePage()}/>
      
    </View>
  )
}


const styles = StyleSheet.create({
  input: {
    height: 50,
    width: (75 / 100) * width_device , 
    margin: 12,
    borderWidth: 1,
    padding: 10,
    color:'black'
  },

  btn_eye:{
    marginTop:25,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    width: (75 / 100) * width_device ,
  }
});