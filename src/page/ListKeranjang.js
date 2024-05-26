import { View, Text, StyleSheet, TouchableOpacity, FlatList,
  Image, Keyboard, TextInput } from 'react-native'
import React, {useState, useEffect,useContext} from 'react'
import { AppContext } from './../context/AppContext';
import { css_global, height_device, width_device } from './../style/StyleGlobal';
import url from './../endpoint/Endpoint';
import { RequestApiPostWithToken, RequestApiNoPromise , RequestApiNoPromiseConditionParam} from './../endpoint/RequestApi';
import { custom_toast } from './../component/ToastCustom';
import { convertNameProdcut, convert_number_coma } from './../component/HelperFunction';
import ComponentLoading from '../component/ComponentLoading';
import ButtonCustom from '../component/ButtonCustom';
import AsyncStorage from '@react-native-community/async-storage';
import ComponentTextInput from './../component/ComponentTextInput';

export default function ListKeranjang({navigation}) {
  const [isLoading, setLoading] = useState(true);
  const [productKeranjang, setProductKeranjang] = useState({})
  const [rincianProd, setRincianProd] = useState([]);
  const [label_price, setLabelPrice] = useState(0);
  const [name_pembeli_val, setNamaPembeli] = useState("");
  const [price_bayar, setPriceBayar ] = useState(0);
  const [kembalian, setPriceKembalian] = useState(0);
  const global_state = useContext(AppContext);
  //const token_ =  AsyncStorage.getItem('keyLogin');//  global_state.userLogin.jwt_token ?  global_state.userLogin.jwt_token :  global_state.userLogin.data_api.jwt_token//global_state.userLogin.data_api.jwt_token;
  const [token_, setTokenKey] = useState('null');

  useEffect(() => {
    const getKeyFunction = async()=>{
      try {
        let keyStorage = await AsyncStorage.getItem('keyLogin');
        setTokenKey(keyStorage);
        console.log('KEYinKeranjang',keyStorage);
      } catch (error) {
        console.error('Error retrieving data from AsyncStorage:', error);
      }
    }
    getKeyFunction();

    refreshtList()
    console.log('use effect did mount list keranjang',global_state.userLogin);
    // const struckId = global_state.product.id_trans
    // console.log(struckId);
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

  const inputNamaPembeli = (val) =>{
    if (val.length > 0) {
      setNamaPembeli(val)
      console.log("ada nama",val);
    }else{
      setNamaPembeli("")
      console.log("tidak ada nama");
    }
    
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
    Keyboard.dismiss();
    setLabelPrice(0)
    setPriceBayar(0)
    setLoading(true)
    // const headers_config ={ headers: {"Authorization" : `Bearer ${token_}`}};
    const tokenNya = await AsyncStorage.getItem('keyLogin')
    
    const url_struck = `${url.end_point_dev}${url.get_struck}`;
    const param = {id_struck : `${global_state.product.id_trans}` }
    //console.log('param-',param);
    RequestApiNoPromiseConditionParam(url_struck,param,tokenNya)
    .then(function(response){
        const data_all = response.data.data[0].data;
        // console.log('sukses get keranjang');
        // console.log(data_all);
        const list_item = data_all.list
        if (list_item.length > 0) {
          const rincian_ = [ data_all.total_harga, data_all.dibayar, data_all.kembalian ]
            setProductKeranjang(list_item)
            setRincianProd(rincian_)
        }else{
            setProductKeranjang(0)
            setRincianProd(0)
        }
        setLoading(false);
    })
    .catch(function (error){
      const json_error = error.toJSON();
      // console.log('error get refresh keranjang');
      // console.log(json_error);
        if(json_error.status == 401) {
            custom_toast("Token expired harap login lagi, tunggu 2 detik")
            setTimeout(() => {
                navigation.navigate('login')
            }, 2000);
        }else{
          if (json_error.status == 404) {
            setProductKeranjang(0)
            setRincianProd(0)
            setPriceBayar(0)
            custom_toast("keranjang kosong")
            setTimeout(() => {
              navigation.navigate('input')
            }, 1000);
          }else{
            custom_toast("Eror get keranjang")
          }
          console.log(json_error.status)
         
          
        }
        setLoading(false);
    })
    
  }

  const removeChartMin1 = async (idChart) =>{
      setLoading(true);
      const url_min1 = `${url.end_point_dev}${url.remove_min_1}`;
      const param = {id_keranjang_kasir : idChart }
      
      RequestApiNoPromise(url_min1, param, token_)
      .then((suk)=>{
        custom_toast("sukses hapus keranjang")
        refreshtList()
        console.log("susses remove 1",suk.data)
      })
      .catch((err)=>{
          const json_error = err.toJSON();
          if(json_error.status == 401) {
              custom_toast("Token expired harap login lagi, tunggu 2 detik")
              setTimeout(() => {
                  navigation.navigate('login')
              }, 2000);
          }else{
            custom_toast("gagal kurangi keranjang")
          }
      })
      .finally(()=>{
        setLoading(false)
      })
  }

  const addChartPlus1 =  (idChart) =>{
    //console.log("awal",isLoading);
    setLoading(true);
    const url_add1 = `${url.end_point_dev}${url.add_plus_1}`;
    const param = {id_keranjang_kasir : idChart }
    RequestApiNoPromise(url_add1,param,token_)
    .then((suk)=>{
      console.log("sukses add plus 1",suk);
      custom_toast("sukses tambah keranjang")
      refreshtList()
    })
    .catch( (error) =>{
      const json_error = error.toJSON();
        if(json_error.status == 401) {
            custom_toast("Token expired harap login lagi, tunggu 2 detik")
            setTimeout(() => {
                navigation.navigate('login')
            }, 2000);
        }else{
          custom_toast("gagal menambahkan keranjang")
        }
        setLoading(false);
    })
    
  }

  const deleteChart =  (idChart) =>{
      setLoading(true);
      const url_delete = `${url.end_point_dev}${url.delete_chart}`;
      const param = {id_keranjang_kasir : idChart }
      RequestApiNoPromise(url_delete, param, token_)
      .then((suk)=>{
        refreshtList()
      })
      .catch((err)=>{
          const json_error = err.toJSON();
          console.log("error hapus ",err.response)
          console.log(err)
          console.log(json_error.status)
          
          if(json_error.status == 401) {
              custom_toast("Token expired harap login lagi, tunggu 2 detik")
              setTimeout(() => {
                  navigation.navigate('login')
              }, 2000);
          }else if(json_error.status == 404){
            setProductKeranjang(0)
            setRincianProd(0)
            setPriceBayar(0)
            custom_toast("keranjang, harap generate transaksi ulang")
            setTimeout(() => {
              navigation.navigate('input')
            }, 500);
           
          }else{
            custom_toast("gagal hapus keranjang")
          }
      })
      .finally(()=>{
        setLoading(false)
      })

  }


 

  const reqApiInputUserBeli = () =>{
    setLoading(true);
    const url_bayar = `${url.end_point_dev}${url.price_user_bayar}`
    
    //cek nama pembeli ada
    const param = name_pembeli_val.length > 0 ? 
      { id_struck : global_state.product.id_trans, user_bayar : price_bayar, nama_pembeli : name_pembeli_val }
      :
      { id_struck : global_state.product.id_trans, user_bayar : price_bayar }
   
    RequestApiNoPromise(url_bayar, param, token_)
    .then((response)=>{
      //console.log(response);
      const res_success = response.data.data;
      const bayar_res = res_success.pembeli_bayar;
      const kembalian_res = res_success.kembalian;
      setPriceKembalian(kembalian_res);
      setPriceBayar(bayar_res)
      navigation.navigate('listPrint')
    })
    .catch((err)=>{
        const json_error = err.toJSON();
        if(json_error.status == 401) {
            custom_toast("Token expired harap login lagi, tunggu 2 detik")
            setTimeout(() => {
                navigation.navigate('login')
            }, 2000);
        }

        if(err.response.data.data.user_bayar) {
          custom_toast(`Pembeli harus bayar lebih dari sama dengan ${rincianProd[0]}`)
          setPriceBayar(0)
          setPriceKembalian(0);
        }else{
          custom_toast(`Error input user bayar`)
        }
    })
    .finally(()=>{
      setLoading(false)
    });
   
  }

  const itemRednerList = ({item, index}) =>{
    //console.log('tess--',item);
    const id_chart = item.id_keranjang_kasir;
    return(
      <View style={{height:(22 / 100) * height_device,left:10,top:10}}>
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth:3,
          }}
        />
        <Text style={{fontSize:15,color:"black"}}>Name:  {convertNameProdcut(item.nama_product,item.is_kg,item.subname, item.nama_product_variant)}</Text>
        <Text style={{color:"black"}}>Harga tiap item: {convert_number_coma(item.harga_tiap_item)} </Text>
        <Text style={{color:"black"}}>Jumlah : {item.jumlah_item_dibeli} {item.is_kg == 1 ? "kg/liter" : "PCS"}</Text>
        <Text style={{color:"black"}}>Total harga item : {convert_number_coma(item.total_harga_item)}</Text>
        <View style={{flex:1,flexDirection:'row'}}>
          <TouchableOpacity 
            onPress={(e)=>addChartPlus1(id_chart)}
            style={{backgroundColor:'blue',width:(10 / 100) * width_device,height:(10 / 100) * width_device,top:(2 / 100) * width_device, borderRadius:8,...css_global.centerItemButton}}>
            <Text style={{textAlign:'center',fontSize:18,color:'white'}}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={(e)=>removeChartMin1(id_chart)}
            style={{backgroundColor:'blue',width:(10 / 100) * width_device,height:(10 / 100) * width_device,top:(2 / 100) * width_device,left:10, borderRadius:8,...css_global.centerItemButton}}>
            <Text style={{textAlign:'center',fontSize:30,color:'white'}}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={(e)=>deleteChart(id_chart)}
            style={{width:(10 / 100) * width_device,height:(10 / 100) * width_device,top:(2 / 100) * width_device,left:20, borderRadius:8}}>
                      <Image 
                        source={require('../img/trash.png')} 
                        resizeMode="contain"
                        style={{
                            width:(10 / 100) * width_device,
                            height:(10 / 100) * width_device,
                        }}
                      />
          </TouchableOpacity>
        </View>
       
      </View>
    )
  }

  return (
    <View>
      <Text style={{color:'black',marginLeft:12,marginBottom:15,marginTop:10}}>No Transaksi {global_state.product.id_trans}</Text>
      {/* <TouchableOpacity 
       onPress={()=> refreshtList()}
       style={css_global.buttonStyle}>
        <Text style={css_global.textStyleButton}>Refresh</Text>
      </TouchableOpacity> */}
      <View style={{flexDirection:'row'}}>
          <ButtonCustom
            mLeft={(3 / 100) *  width_device}
            mTop={(1 / 100) *  height_device}
            f_size={13}
            widthCusBtn={(11 / 100) *  height_device}
            heightBtnPercentDevice={5}
            text={"Refresh"} 
            isSuccess={true} 
            btnOnSubmitProps={() => refreshtList()}
          />

        <TextInput
          placeholder="input nama pembeli (max 20)"
          placeholderTextColor="grey"
          onChangeText={(e)=>inputNamaPembeli(e)}
          maxLength={19}
          style={{  
            height: (5 / 100) *  height_device,
            marginTop:7,
            marginLeft:(5 / 100) * width_device,
            width: (55 / 100) * width_device,
            borderWidth: 1.5,
            borderRadius:4,
            color:'black',
            backgroundColor:'white',
            paddingLeft:10,
          }}
        />
      </View>
     
      
      <Text style={css_global.textStyle}>Masukkan uang pembeli</Text>
      <Text style={{backgroundColor:'white', top:5,left:12,textAlign:'left',color:'black'}}>
        {label_price}
      </Text>
     
      <ComponentTextInput
          functioOnChangeCustom={(e)=>inputPricePembeli(e)}
          can_edit={true}
          tipeKeyboardProps="numeric"
      />

      <ButtonCustom
         mLeft={(3 / 100) * width_device}
         mTop={(1 / 100) *  height_device}
         f_size={14}
         widthCusBtn={(18 / 100) * width_device}
         heightBtnPercentDevice={6}
         text={"Hitung"} 
         isSuccess={true} 
         btnOnSubmitProps={() => reqApiInputUserBeli()}
      />
    

      <View style={style.wrapList}>
            {isLoading ? 
              <ComponentLoading/> : 
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
                    <Text style={{color:'black',top:(0.001 / 100) *  height_device,fontSize:15,fontWeight:'bold'}}>Total : {rincianProd[0]} | bayar {convert_number_coma(price_bayar)}</Text>
                 </View>

              )}
      </View>
    </View>
  )
}

const style =  StyleSheet.create({
  wrapList :{
      marginTop:(2 / 100) * height_device,
      marginBottom:(4 / 100) *  height_device,
      height:(40 / 100) * height_device,
      width:'80%'
  },
  viewList:{
    height:(45 / 100) *  height_device,
    backgroundColor:'#fbf2c6',
    alignContent:'center',
    borderRadius:6,
    left:(5 / 100) * width_device,
    width:(87/ 100) *  width_device
  }
})