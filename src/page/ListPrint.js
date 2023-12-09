import { View, Text,FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import React,{useState, useEffect,useContext} from 'react'
import { RequestApiPostWithToken, RequestApiNoPromise } from './../endpoint/RequestApi';
import { custom_toast } from './../component/ToastCustom';
import { convert_number_coma,convertNameProdcut, date_now_wib } from './../component/HelperFunction';
import { BluetoothEscposPrinter } from 'react-native-bluetooth-escpos-printer';
import AsyncStorage from '@react-native-community/async-storage';
import { AppContext } from './../context/AppContext';
import url from './../endpoint/Endpoint';
import { css_global } from './../style/StyleGlobal';
import ComponentLoading from '../component/ComponentLoading';
import ButtonCustom from '../component/ButtonCustom';

export default function ListPrint({navigation}) {
  const global_state = useContext(AppContext);
  //const token_ =  global_state.userLogin.jwt_token ?  global_state.userLogin.jwt_token :  global_state.userLogin.data_api.jwt_token; //global_state.userLogin.jwt_token;//global_state.userLogin.data_api.jwt_token;
  const [isLoading, setLoading] = useState(true);
  const [listProd, setProd] = useState({});
  const [priceBayar, setPriceBayar] = useState(0);
  const [priceKembalian, setPriceKembalian] = useState(0);
  const [priceTotal, setTotal] = useState(0);
  const [dateStruck, setDate] = useState({})
  const [name_buyer, setNameBuyer] = useState("")
  const [token_state, setTokenState] = useState('null');

  useEffect(() => {
    const getKeyFunction = async()=>{
      try {
        let keyStorage = await AsyncStorage.getItem('keyLogin');
        setTokenState(keyStorage);
      } catch (error) {
        console.error('Error retrieving data from AsyncStorage:', error);
      }
      reqViewStruck()
    }
    getKeyFunction();
    
    console.log(global_state.dataBlueTooth);
  }, [])
  

  const reqViewStruck = async()=>{
      setLoading(true)
      const url_struck = `${url.end_point_dev}${url.get_struck}`;
      const tokeNya = await AsyncStorage.getItem('keyLogin');
      const param = {id_struck : `${global_state.product.id_trans}` }
      RequestApiNoPromise(url_struck,param,tokeNya)
      .then((response)=>{
          const data_res = response.data.data[0].data;
          setProd(data_res.list)
          setPriceBayar(data_res.dibayar)
          setPriceKembalian(data_res.kembalian)
          setTotal(data_res.total_harga)
          setDate(data_res.tanggal)
          setNameBuyer(data_res.nama_pembeli)
          //console.log('listPrint',data_res.nama_pembeli);
      })
      .catch((error)=>{
        const json_error = error.toJSON();
        if(json_error.status == 401) {
            custom_toast("Token expired harap login lagi, tunggu 2 detik")
            setTimeout(() => {
                navigation.navigate('login')
            }, 2000);
        }else{
          custom_toast("gagal error get keranjang")
        }
      })
      .finally(()=>{
        setLoading(false)
      })
      console.log(global_state.dataListcBlueToothConnect);
  }

  const btnPrint = async () =>{
      let blueobj = Object.keys(global_state.dataBlueTooth)
      let blueConect = Object.keys(global_state.dataListcBlueToothConnect)
      if (global_state.dataBlueTooth == false || blueobj.length == 0) {
          custom_toast("Bluetooth harap diaktifkan")
          console.log("blue tot tidak aktif");
      }else if(global_state.dataListcBlueToothConnect === "" || blueConect.length == 0){
          custom_toast("Printer bluetooth tidak ada yang terhubung")
          console.log("pragnkt tidakt erhubug");
      }else{
        successPrint();
      }
     
  }

  const successPrint = async ()=>{
    // console.log(listProd);
    
    await BluetoothEscposPrinter.printerUnderLine(1);
    await BluetoothEscposPrinter.printText(`${dateStruck} \n`,{
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 0,
      heigthtimes: 0,
      fonttype: 1,
    })
    await BluetoothEscposPrinter.printText(
      '================================',
      {},
    );
    listProd.map((item,key)=>{
      const name_prd = item.nama_product;
      const jumlah_item = `${item.jumlah_item_dibeli} x ${convert_number_coma(item.harga_tiap_item)} = ${convert_number_coma(item.total_harga_item)}`

       BluetoothEscposPrinter.printText(`${name_prd} \n ${jumlah_item} \n`, {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
        fonttype: 1,
      });

    })
    await BluetoothEscposPrinter.printText(
      '================================ \n',
      {},
    );
    await BluetoothEscposPrinter.printText(`Total belanja  :  ${priceTotal} \n \n`, {
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 0,
      heigthtimes: 0,
      fonttype: 1,
    })
    await BluetoothEscposPrinter.printText(`Bayar  :  ${priceBayar} \n \n`, {
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 0,
      heigthtimes: 0,
      fonttype: 1,
    })
    await BluetoothEscposPrinter.printText(`Kembalian  :  ${priceKembalian} \n \n`, {
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 0,
      heigthtimes: 0,
      fonttype: 1,
    })
    if (name_buyer != null) {
      await BluetoothEscposPrinter.printText(`pembeli  :  ${name_buyer} \n \n`, {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
        fonttype: 1,
      })
    }
    await BluetoothEscposPrinter.printText(
      '-------------------------------- \n',
      {},
    );
    await BluetoothEscposPrinter.printerUnderLine(0);
    await BluetoothEscposPrinter.printText('\r\n', {});
   
    
  }

  const itemRenderProduct = ({item, index}) =>{
    const nameP = convertNameProdcut(item.nama_product,item.is_kg,item.subname, item.nama_product_variant);
    return(
      <View style={{height:80,left:10,top:10}}>
          <View
            style={{
              borderBottomColor: 'black',
              borderBottomWidth:3,
            }}
          />
          <Text style={{color:'black'}}>{nameP}</Text>
          <Text style={{color:'black'}}>{item.jumlah_item_dibeli} x {convert_number_coma(item.harga_tiap_item)} = {convert_number_coma(item.total_harga_item)}</Text>
      </View>
    )
  }

  return (
    <View>
      <Text style={{color:'black',marginLeft:12,top:10}}>No Transaksi : {`${global_state.product.id_trans}`}</Text>

      <ButtonCustom
         mLeft={12}
         mTop={19}
         f_size={13}
         widthCusBtn={80}
         heightBtnPercentDevice={5}
         text={"Refresh"} 
         isSuccess={true} 
         btnOnSubmitProps={() => reqViewStruck()}
      />
    
      <ButtonCustom
         mLeft={12}
         mTop={10}
         f_size={16}
         widthCusBtn={75}
         heightBtnPercentDevice={6}
         text={"Print"} 
         isSuccess={true} 
         btnOnSubmitProps={() => btnPrint()}
      />
      <View style={style.wrapList}>
            {isLoading ? 
              <ComponentLoading/> :  
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
              <View style={{backgroundColor:'white',left:20,marginTop:0,borderRadius:8,height:70}}>
                <Text style={{color:'black',left:10}}>Total : {priceTotal} | bayar {convert_number_coma(priceBayar)}</Text>
                <Text style={{color:'black',left:10}}>Kembalian : {priceKembalian}</Text>
                { name_buyer != null ?
                  <Text style={{color:'black',left:10, marginBottom:10}}>Pembeli : {name_buyer}</Text>
                  :
                  <View></View>
                 
                }
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
    backgroundColor:'white',
    alignContent:'center',
    borderRadius:6,
    left:20
  }
})