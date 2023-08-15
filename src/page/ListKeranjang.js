import { View, Text, StyleSheet, TouchableOpacity, FlatList, 
  TextInput,
  ActivityIndicator,
  Image } from 'react-native'
import React, {useState, useEffect,useContext} from 'react'
import { AppContext } from './../context/AppContext';
import { css_global } from './../style/StyleGlobal';
import url from './../endpoint/Endpoint';
import { RequestApiPostWithToken } from './../endpoint/RequestApi';
import { custom_toast } from './../component/ToastCustom';
import { convert_number_coma } from './../component/HelperFunction';

export default function ListKeranjang({navigation}) {
  const [isLoading, setLoading] = useState(true);
  const [productKeranjang, setProductKeranjang] = useState({})
  const [rincianProd, setRincianProd] = useState([]);
  const [label_price, setLabelPrice] = useState(0);
  const [price_bayar, setPriceBayar ] = useState(0);
  const [kembalian, setPriceKembalian] = useState(0);
  const global_state = useContext(AppContext);
  const token_ =  global_state.userLogin.data_api.jwt_token;

  useEffect(() => {
    refreshtList()
    console.log('use effect did mount');
  }, [])
  

  const inputPricePembeli = (val) =>{
    if (val > 0) {
      const convert_val = convert_number_coma(val);
      setLabelPrice(convert_val)
      setPriceBayar(val)
    }else{
      setLabelPrice(0)
      setPriceBayar(0)
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
       if (list_item.length > 0) {
          const rincian_ = [ data_all.total_harga, data_all.dibayar, data_all.kembalian ]
          setProductKeranjang(list_item)
          setRincianProd(rincian_)
       }else{
        setProductKeranjang(0)
        setRincianProd(0)
       }
       console.log('sukk',send_api);
       
       
    } catch (error) {
       setProductKeranjang({})
       console.log('err dat',error);
    }
    setLoading(false);
   
    
  }

  const removeChartMin1 = async (idChart) =>{
      setLoading(true);
      const url_add1 = `${url.end_point_dev}${url.remove_min_1}`;
      const param = {id_keranjang_kasir : idChart }
      const send_api = await RequestApiPostWithToken(url_add1,param, token_)
      try {
        refreshtList()
      } catch (error) {
        custom_toast("gagal kurangi keranjang")
      }
      setLoading(false);
  }

  const addChartPlus1 = async (idChart) =>{
    setLoading(true);
    const url_add1 = `${url.end_point_dev}${url.add_plus_1}`;
    const param = {id_keranjang_kasir : idChart }
    const send_api = await RequestApiPostWithToken(url_add1,param, token_)
    try {
       refreshtList()
    } catch (error) {
      custom_toast("gagal menambahkan keranjang")
    }
    setLoading(false);
  }

  const deleteChart = async (idChart) =>{
      setLoading(true);
      const url_add1 = `${url.end_point_dev}${url.delete_chart}`;
      const param = {id_keranjang_kasir : idChart }
      const send_api = await RequestApiPostWithToken(url_add1,param, token_)
      try {
        refreshtList()
      } catch (error) {
        custom_toast("gagal hapus keranjang")
      }
      setLoading(false);
  }

  function checkState () {
    // setLoading(false)
    console.log('cek state, loding', isLoading);
   
  }

  const reqApiInputUserBeli = async () =>{
    setLoading(true);
    const url_bayar = `${url.end_point_dev}${url.price_user_bayar}`
    const param = { id_struck : global_state.product.id_trans, user_bayar : price_bayar }
    try {
      const send_api = await RequestApiPostWithToken(url_bayar, param, token_);
      const res_success = send_api.data.data;
      const bayar_res = res_success.pembeli_bayar;
      const kembalian_res = res_success.kembalian;
      setPriceKembalian(kembalian_res);
      setPriceBayar(bayar_res)
      navigation.navigate('listPrint')
    } catch (error) {
       if (error.response.data.data.user_bayar) {
         custom_toast(`Pembeli harus bayar lebih dari sama dengan ${rincianProd[0]}`)
         setPriceBayar(0)
         setPriceKembalian(0);
       }
    } finally {
      console.log('finally');
    }
    setLoading(false);
    

  }

  const itemRednerList = ({item, index}) =>{
    const id_chart = item.id_keranjang_kasir;
    return(
      <View style={{height:150,left:10,top:10}}>
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth:3,
          }}
        />
        <Text>Name: {item.nama_product}</Text>
        <Text>Harga tiap item: {convert_number_coma(item.harga_tiap_item)} </Text>
        <Text>Jumlah : {item.jumlah_item_dibeli}</Text>
        <Text>Total harga item : {convert_number_coma(item.total_harga_item)}</Text>
        <View style={{flex:1,flexDirection:'row'}}>
          <TouchableOpacity 
            onPress={(e)=>addChartPlus1(id_chart)}
            style={{backgroundColor:'blue',width:40,height:40,top:8, borderRadius:8}}>
            <Text style={{textAlign:'center',top:6,fontSize:18}}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={(e)=>removeChartMin1(id_chart)}
            style={{backgroundColor:'blue',width:40,height:40,top:8,left:10, borderRadius:8}}>
            <Text style={{textAlign:'center',fontSize:30}}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={(e)=>deleteChart(id_chart)}
            style={{width:40,height:40,top:8,left:20, borderRadius:8}}>
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
    <View style={{backgroundColor:'white'}}>
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
      <TouchableOpacity 
          disabled={price_bayar > 0 ? false : true}
          onPress={()=> reqApiInputUserBeli()}
          style={css_global.buttonStyle}>
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
                    <Text style={{color:'black',top:25}}>Total : {rincianProd[0]} | bayar {convert_number_coma(price_bayar)}</Text>
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
    left:20,
    width:350
  }
})