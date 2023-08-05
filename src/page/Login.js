import { View, Text, Button, StyleSheet, TextInput, ToastAndroid } from 'react-native'
import React,{useContext, useState} from 'react'
import { AppContext } from './../context/AppContext';
import axios from 'axios';

import url from './../endpoint/Endpoint';

export default function Login({navigation}) {

  const [email, setEmail] = useState({});
  const [pass, setPass] = useState('');
    const contexst = useContext(AppContext)
    console.log('tess-',contexst.user.name);

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

    //
    const submitToHomePage = async()=>{
        const email_user = email.email;
        const pass_user = pass.pass;

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
          if (result_api.status == 200) {
            contexst.setUserLogin({data_api});
            navigation.navigate('listtabhome')
          }
          console.log('sukses login');
        } catch (error) {
            let msg_error = error.response.data.message;
            ToastAndroid.showWithGravity(
              msg_error,
              ToastAndroid.SHORT,
              ToastAndroid.CENTER
            );
        }
       
    }

  return (
    <View>
      <Text style={{color:'black'}}>Login</Text>
      <Text style={{color:'black'}}>{contexst.user.name}</Text>
      <TextInput
        style={styles.input}
        placeholder="input email"
        onChangeText={(input)=>setEmail({email:input})}
      />
      <TextInput
        style={styles.input}
        placeholder="input password"
        onChangeText={(input)=>setPass({pass:input})}
      />
      <Button
        title="login"
        onPress={() => submitToHomePage()}
      />
      {/* <Button title="Set state" onPress ={()=>contexst.setUser({name:'ini state'})}/> */}
      <Text style={{color:'black'}}>rewre</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    color:'black'
  },
});