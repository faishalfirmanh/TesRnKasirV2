import { View, 
    Text, 
    TouchableOpacity, 
    StyleSheet,
    FlatList,
    ActivityIndicator,
    ScrollView,
    TextInput,
    ToastAndroid
 } from 'react-native'
import React, {useState, useEffect,useContext} from 'react'
import InputSearch from './../component/InputSearch';
import { css_global } from './../style/StyleGlobal';
import { AppContext } from './../context/AppContext';
import axios from 'axios';
import url from './../endpoint/Endpoint';
import { RequestApiPostWithToken,RequestApiPostGenerate } from './../endpoint/RequestApi';
import { custom_toast } from './../component/ToastCustom';

export default function ListPage() {

    const global_state = useContext(AppContext);
    const token_ =  global_state.userLogin.data_api.jwt_token;

    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([])
    const [code, setCode] = useState('')
    const [inputProd, setInputProd] = useState({})
    const [product, setProduct] = useState({})
    

    useEffect(()=>{
        getUser();
        return ()=>{

        }
        if (code == '') {
            ToastAndroid.showWithGravity(
                'Harap generate kode',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
        }
    },[])

    const getUser = ()=>{
        const urlDummy = 'https://jsonplaceholder.typicode.com/users';
        fetch(urlDummy)
        .then((res)=> res.json())
        .then((resJson)=>{
            console.log('rrr',resJson);
            setData(resJson)
        })
        .catch((err)=>{
        console.log(err);
        })
        .finally(()=>setLoading(false))
    }

    const generateNewStruck = async () =>{
        const toko_id = global_state.userLogin.data_api.toko.id_toko
        const url_generate = `${url.end_point_dev}${url.generate}`

        /** testing */
        global_state.setProduct({id_trans : '27'});
        setCode('27');

        /** real api (bisa) tess */
        // const result_api = await RequestApiPostGenerate(url_generate,token_);
        // try {
        //     const id_trans = result_api.data.data.id_struck.toString();
        //     global_state.setProduct({id_trans : id_trans});
        //     setCode(id_trans);
        // } catch (error) {
        //    console.log('error generate',error);   
        //    global_state.setProduct({id_trans : null});
        // }

        
        
    }

    const detail = (id) =>{
        const urlDetail = `https://jsonplaceholder.typicode.com/users/${id}`;
        fetch(urlDetail)
        .then((res)=> res.json())
        .then((resJson)=>{
            console.log('detail',resJson.address);
        })
        .catch((err)=>{
        console.log(err);
        })
    }

    const sugestProductList = async (val) =>{
        
        if (code == '') {
            ToastAndroid.showWithGravity(
                'Harap generate kode',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
              );
        }else{
             if (val.length > 0) {
                setInputProd(val);
                setLoading(true);
                try {
                    const url_api_req = `${url.end_point_dev}${url.url_search_product}`;
                    const send_param = { keyword : val}
                    const send_api = await RequestApiPostWithToken(url_api_req,send_param,token_)
                    if (send_api.data.total_data > 0) {
                        console.log(send_api.data.data);
                        setProduct(send_api.data.data)
                    }else{
                        setProduct(send_api.data.data)
                        console.log('data tidak ada');
                    }
                } catch (error) {
                    setProduct(0)
                    console.log('error',error);
                }
                setLoading(false);
            }else{
                const url_api_req = `${url.end_point_dev}${url.url_search_product}`;
                const send_param = { keyword : ''}
                const send_api = await RequestApiPostWithToken(url_api_req,send_param,token_)
                setProduct(send_api.data.data)
                console.log('input null-',send_api.data.data);
                setLoading(false)
            }
        } 
      
    }

    const renderItemgetUser = ({item, index})=>{
        return (
            <TouchableOpacity
                onPress={()=> detail(item.id)}
                style={
                   
                    {
                    marginTop: 8,
                    marginLeft:12,
                    height:40,
                    backgroundColor:'#f9c2ff',
                }}
            >
               <Text style={{color:'black',left:40, alignContent: 'center'}}>{item.username}</Text> 
            </TouchableOpacity>
        )
    }


    const addProductToKeranjang = async (id_product) =>{
        const url_ad = `${url.end_point_dev}${url.create_chart}`;
        const param_add = {
            struck_id : code,
            status : 0,
            product_jual_id : id_product,
            jumlah_item_dibeli: 1
        }
        // const res_api = await RequestApiPostWithToken(url_ad,param_add,token_)
        // try {
        //     const sukses_keranjang = res_api.data
        //     custom_toast("sukses menambahkan ke keranjang");
        //     console.log('sukses keranjnag');
        //     console.log(sukses_keranjang);
        // } catch (error) {
        //     console.log('error add keranjang');
        // }
        const headers_config = { headers: {"Authorization" : `Bearer ${token_}`}};
        axios.post(url_ad, param_add, headers_config)
        .then(function (response) {
            const sukses_keranjang = response.data
            custom_toast("sukses menambahkan ke keranjang");
            console.log('suk',response);
        })
        .catch(function (error,param2) {
            if (error.response.data.data) {
                if (error.response.data.data.struck_id[0]) { //select id invalid
                    //console.log('error id',error.response.data.data.struck_id[0]);
                    custom_toast(error.response.data.data.struck_id[0])
                }
                else if(error.response.data.data[0].data.id_keranjang_kasir) { 
                    //1 transaksi hanya 1 variant
                    const err = error.response.data.data[0].data.id_keranjang_kasir
                    custom_toast(err)
                } 
            }
        });
    }


    const renderItemProduct = ({item, index}) => {
        return (
            <TouchableOpacity
                onPress={()=> addProductToKeranjang(item.id_product_jual)}
                style={
                   
                    {
                    marginTop: 8,
                    marginLeft:12,
                    height:40,
                    backgroundColor:'#BCC6CC',
                }}
            >
               <Text style={{color:'black',left:14,top: 5, alignContent: 'center'}}>{item.nama_product}</Text> 
            </TouchableOpacity>
        )
    }
  return (
    <View style={{flex:1}}>
        
        <Text style={{color:'black'}}>ListPage</Text>
        <Text style={css_global.textStyle}>1. Generate Kode transaksi</Text>
        <TextInput style={css_global.textInputStyle} value={code} editable={false}></TextInput>
        <TouchableOpacity 
            onPress={()=>generateNewStruck()}
            style={css_global.buttonStyle}
            disabled={false}>
            <Text style={css_global.textStyleButton}>Generate</Text>
        </TouchableOpacity>

        <Text style={css_global.textStyle}>2. Masukkan nama product</Text>
        <TextInput 
            onChangeText={(e)=>sugestProductList(e)}
            editable={code == '' ? false : true}
            style={css_global.textInputStyle}>
        </TextInput>

        <View style={style.wrapList}>
            {isLoading ? <ActivityIndicator/> : (
                product.length < 1 ? (
                    <View>
                        <Text style={{backgroundColor:'yellow',color:'black',marginLeft:12}}>Tidal ada</Text>
                    </View>
                ) :
                <FlatList
                data={product}
                renderItem={renderItemProduct}
                keyExtractor={item => `${item.id_product_jual}`}
                />
            )}
        </View>
       
    </View>
  )
}

/** nama barang |satuan |harga */
const style =  StyleSheet.create({
    wrapList :{
        marginTop:16,
        marginBottom:100,
        height:350,
        width:'80%'
    }
})