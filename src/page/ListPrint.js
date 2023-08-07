import { View, Text,FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import React,{useState, useEffect,useContext} from 'react'
import { RequestApiPostWithToken } from './../endpoint/RequestApi';
import { custom_toast } from './../component/ToastCustom';
import { convert_number_coma } from './../component/HelperFunction';
import { AppContext } from './../context/AppContext';
import url from './../endpoint/Endpoint';
import { css_global } from './../style/StyleGlobal';

export default function ListPrint() {
  const global_state = useContext(AppContext);
  const token_ =  global_state.userLogin.data_api.jwt_token;
  const [isLoading, setLoading] = useState(true);
  const [listProd, setProd] = useState({});
  const [priceBayar, setPriceBayar] = useState(0);
  const [priceKembalian, setPriceKembalian] = useState(0);
  const [priceTotal, setTotal] = useState(0);

  const reqViewStruck = async ()=>{
      setLoading(true)
      const url_struck = `${url.end_point_dev}${url.get_struck}`;
      const param = {id_struck : `${global_state.product.id_trans}` }
      const send_api = await RequestApiPostWithToken(url_struck,param, token_)
      try {
          const data_res = send_api.data.data[0].data;
          setProd(data_res.list)
          setPriceBayar(data_res.dibayar)
          setPriceKembalian(data_res.kembalian)
          setTotal(data_res.total_harga)
          console.log('sukses req struck', data_res);
      } catch (error) {
        console.log('error get', error);
      }  
      setLoading(false)
  }


  const btnPrint = () =>{
    console.log(listProd);
    console.log('Print');
  }

  const itemRenderProduct = ({item, index}) =>{
    return(
      <View style={{height:80,left:10,top:10}}>
          <View
            style={{
              borderBottomColor: 'black',
              borderBottomWidth:3,
            }}
          />
          <Text>{item.nama_product}</Text>
          <Text>{item.jumlah_item_dibeli} x {convert_number_coma(item.harga_tiap_item)} = {convert_number_coma(item.total_harga_item)}</Text>
      </View>
    )
  }

  return (
    <View>
      <Text style={{color:'black',marginLeft:12,top:10}}>No Transaksi : {`${global_state.product.id_trans}`}</Text>
      <TouchableOpacity 
        style={{...css_global.buttonStyle, marginTop:20}}
        onPress={()=> reqViewStruck()}>
        <Text style={css_global.textStyleButton}>refresh</Text>
      </TouchableOpacity>
      <TouchableOpacity
         onPress={()=>btnPrint()}
         style={css_global.buttonStyle}
        >
        <Text style={css_global.textStyleButton}>Print</Text>
      </TouchableOpacity>
      <View style={style.wrapList}>
            {isLoading ? 
              <ActivityIndicator/> :  
              <View style={style.viewList}>
                <FlatList
                  data={listProd}
                  renderItem={itemRenderProduct}
                  keyExtractor={item => `${item.id_keranjang_kasir}`}
                />
              </View>
            }
            {
              isLoading ? <ActivityIndicator/> :
              <View style={{backgroundColor:'green',left:20,marginTop:0,borderRadius:8,height:60}}>
                <Text style={{color:'white',left:10}}>Total : {priceTotal} | bayar {convert_number_coma(priceBayar)}</Text>
                <Text style={{color:'white',left:10}}>Kembalian : {priceKembalian}</Text>
              </View>
            }
      </View>
    </View>
  )
}

const style =  StyleSheet.create({
  wrapList :{
      marginTop:16,
      marginBottom:20,
      width:'80%'
  },
  viewList:{
    height:380,
    backgroundColor:'green',
    alignContent:'center',
    borderRadius:6,
    left:20
  }
})