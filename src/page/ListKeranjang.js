import { View, Text, StyleSheet, TouchableOpacity, FlatList,
  Image, Keyboard } from 'react-native'
import React, {useState, useEffect,useContext} from 'react'
import { AppContext } from './../context/AppContext';
import { css_global } from './../style/StyleGlobal';
import url from './../endpoint/Endpoint';
import { RequestApiPostWithToken, RequestApiNoPromise } from './../endpoint/RequestApi';
import { custom_toast } from './../component/ToastCustom';
import { convertNameProdcut, convert_number_coma } from './../component/HelperFunction';
import ComponentLoading from '../component/ComponentLoading';
import ButtonCustom from '../component/ButtonCustom';

import ComponentTextInput from './../component/ComponentTextInput';

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
    console.log('use effect did mount',isLoading);
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
    Keyboard.dismiss();
    setLabelPrice(0)
    setPriceBayar(0)
    setLoading(true)
    const headers_config ={ headers: {"Authorization" : `Bearer ${token_}`}};
    const url_struck = `${url.end_point_dev}${url.get_struck}`;
    const param = {id_struck : `${global_state.product.id_trans}` }
    RequestApiNoPromise(url_struck,param,token_)
    .then((response)=>{
        const data_all = response.data.data[0].data;
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
    .catch( (error) =>{
      const json_error = error.toJSON();
        if(json_error.status == 401) {
            custom_toast("Token expired harap login lagi, tunggu 2 detik")
            setTimeout(() => {
                navigation.navigate('login')
            }, 2000);
        }else{
          custom_toast("Eror get keranjang")
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
        refreshtList()
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
    console.log("awal",isLoading);
    setLoading(true);
    const url_add1 = `${url.end_point_dev}${url.add_plus_1}`;
    const param = {id_keranjang_kasir : idChart }
    RequestApiNoPromise(url_add1,param,token_)
    .then((suk)=>{
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
          if(json_error.status == 401) {
              custom_toast("Token expired harap login lagi, tunggu 2 detik")
              setTimeout(() => {
                  navigation.navigate('login')
              }, 2000);
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
    const param = { id_struck : global_state.product.id_trans, user_bayar : price_bayar }
    RequestApiNoPromise(url_bayar, param, token_)
    .then((response)=>{
      console.log(response);
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
    console.log('tess--',item);
    const id_chart = item.id_keranjang_kasir;
    return(
      <View style={{height:160,left:10,top:10}}>
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
            style={{backgroundColor:'blue',width:40,height:40,top:8, borderRadius:8}}>
            <Text style={{textAlign:'center',top:6,fontSize:18}}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={(e)=>removeChartMin1(id_chart)}
            style={{backgroundColor:'blue',width:40,height:40,top:8,left:10, borderRadius:8}}>
            <Text style={{textAlign:'center',fontSize:30,marginTop:-6}}>-</Text>
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
    <View>
      <Text style={{color:'black',marginLeft:12,marginBottom:15,marginTop:10}}>No Transaksi {global_state.product.id_trans}</Text>
      {/* <TouchableOpacity 
       onPress={()=> refreshtList()}
       style={css_global.buttonStyle}>
        <Text style={css_global.textStyleButton}>Refresh</Text>
      </TouchableOpacity> */}
      <ButtonCustom
         mLeft={12}
         mTop={5}
         f_size={13}
         widthCusBtn={80}
         heightBtnPercentDevice={5}
         text={"Refresh"} 
         isSuccess={true} 
         btnOnSubmitProps={() => refreshtList()}
      />
      
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
         mLeft={12}
         mTop={5}
         f_size={14}
         widthCusBtn={75}
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
    backgroundColor:'#fbf2c6',
    alignContent:'center',
    borderRadius:6,
    left:20,
    width:350
  }
})