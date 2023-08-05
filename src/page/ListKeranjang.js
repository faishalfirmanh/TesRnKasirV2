import { View, Text, StyleSheet, TouchableOpacity, FlatList, 
  TextInput,
  ActivityIndicator,
  Image } from 'react-native'
import React, {useState, useEffect,useContext} from 'react'
import { AppContext } from './../context/AppContext';
import { css_global } from './../style/StyleGlobal';
import url from './../endpoint/Endpoint';
import { RequestApiPostWithToken } from './../endpoint/RequestApi';

export default function ListKeranjang() {
  const [isLoading, setLoading] = useState(true);
  const [productKeranjang, setProductKeranjang] = useState({})
  const [rincianProd, setRincianProd] = useState([]);
  const [label_price, setLabelPrice] = useState(0);
  const global_state = useContext(AppContext);
  const token_ =  global_state.userLogin.data_api.jwt_token;

  useEffect(() => {
    console.log('KERANJANG page', global_state.product);
  
    return () => {
      
    }
  }, [])
  

  const inputPricePembeli = (val) =>{
    if (val > 0) {
      const convert_val = parseInt(val).toLocaleString();
      setLabelPrice(convert_val)
    }else{
      setLabelPrice(0)
      console.log(val);
    }
    console.log('vall',val);
    
  }


  const CallApiGetStruck = async () =>{
     const url_struck = `${url.end_point_dev}${url.get_struck}`;
     const param = {id_struck : `${global_state.product.id_trans}` }
     const send_api = await RequestApiPostWithToken(url_struck,param, token_)
     try {
        console.log('Sukses get',send_api.data);
     } catch (error) {
       console.log('error get', error);
     }

  }


  const refreshtList = async () => {
    setLoading(true)
    console.log('state==', global_state.product.id_trans);
    const url_struck = `${url.end_point_dev}${url.get_struck}`;
    const param = {id_struck : `${global_state.product.id_trans}` }
    const send_api = await RequestApiPostWithToken(url_struck,param, token_)
    try {
       const data_all = send_api.data.data[0].data;
       const list_item = data_all.list
       const rincian_ = [ data_all.total_harga, data_all.dibayar, data_all.kembalian ]
       setProductKeranjang(list_item)
       setRincianProd(rincian_)
       console.log(list_item);
    } catch (error) {
       setProductKeranjang({})
    }
    setLoading(false);
   
    
  }

  function checkState () {
    // setLoading(false)
    console.log('cek state, loding', isLoading);
   
  }

  const itemRednerList = ({item, index}) =>{
    return(
      <View style={{height:150,left:10,top:10}}>
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth:3,
          }}
        />
        <Text>Name: {item.nama_product}</Text>
        <Text>Harga tiap item: {item.harga_tiap_item} </Text>
        <Text>Jumlah : {item.jumlah_item_dibeli}</Text>
        <Text>Total harga item : {item.total_harga_item}</Text>
        <View style={{flex:1,flexDirection:'row'}}>
          <TouchableOpacity style={{backgroundColor:'blue',width:40,height:40,top:8, borderRadius:8}}>
            <Text style={{textAlign:'center', textAlignVertical: 'center'}}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{backgroundColor:'blue',width:40,height:40,top:8,left:10, borderRadius:8}}>
            <Text style={{textAlign:'center',alignItems: 'center'}}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{width:40,height:40,top:8,left:20, borderRadius:8}}>
                      <Image 
                        source={require('../img/trash.png')} 
                        resizeMode="contain"
                        style={{
                            width:40,
                            height:40,
                        }}
                      />
          </TouchableOpacity>
        </View>
       
      </View>
    )
  }

  return (
    <View>
      <Text style={{color:'black'}}>ListKeranjang</Text>
      <Text style={{color:'black'}}>No Transaksi {global_state.product.id_trans}</Text>
      <TouchableOpacity 
       onPress={()=> refreshtList()}
       style={css_global.buttonStyle}>
        <Text style={css_global.textStyleButton}>Refresh</Text>
      </TouchableOpacity>
      
      <Text style={css_global.textStyle}>Masukkan uang pembeli</Text>
      <Text style={{backgroundColor:'white', top:5,left:12,textAlign:'left',color:'black'}}>
        {label_price}
      </Text>
      <TextInput 
        onChangeText={(e)=> inputPricePembeli(e)}
        keyboardType='numeric'
        style={css_global.textInputStyle}>

      </TextInput>
      <TouchableOpacity style={css_global.buttonStyle}>
         <Text style={css_global.textStyleButton}>Hitung</Text>
      </TouchableOpacity>
    

      <View style={style.wrapList}>
            {isLoading ? 
              <ActivityIndicator/> : 
              (
                productKeranjang.length < 1 ? 
                 (
                  <View style={{backgroundColor:'yellow'}}><Text style={{color:'black'}}>Kosong tidak ada</Text></View>
                 ) :
                 <View style={style.viewList}>
                    <FlatList
                      data={productKeranjang}
                      renderItem={itemRednerList}
                      keyExtractor={item => `${item.id_keranjang_kasir}`}
                    />
                    <Text style={{color:'black',top:25}}>Total : {rincianProd[0]}</Text>
                 </View>

              )}
      </View>
    </View>
  )
}

const style =  StyleSheet.create({
  wrapList :{
      marginTop:16,
      marginBottom:20,
      height:350,
      width:'80%'
  },
  viewList:{
    height:340,
    backgroundColor:'green',
    alignContent:'center',
    borderRadius:6,
    left:20
  }
})