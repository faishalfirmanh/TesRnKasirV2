import { View, Text,FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
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
  const [oriceTotal, setTotal] = useState(0);

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



  return (
    <View>
      <Text style={{color:'black'}}>ListPrint</Text>
      <TouchableOpacity onPress={()=> reqViewStruck()}>
        <Text style={css_global.textStyle}>tess</Text>
      </TouchableOpacity>
    </View>
  )
}