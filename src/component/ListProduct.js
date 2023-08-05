import { 
    View, 
    Text,
    FlatList, 
    StyleSheet, 
    StatusBar, 
    SafeAreaView , 
    ScrollView, 
    ActivityIndicator,
TouchableOpacity  } from 'react-native'
import React, {useState, useEffect} from 'react'

const DATAdo = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
    },
    {
        id: '1',
        title: 'coba',
    },
    {
        id: '2',
        title: 'tes',
    },
    {
        id: '3',
        title: 'tes2',
    },
    {
        id: '4',
        title: 'tes3',
    },
    {
        id: '5',
        title: 'tes4',
    },
    {
        id: '434d',
        title: 'tes-oasa',
    },
    {
        id: '6',
        title: 'tes6',
    },
    {
        id: '7',
        title: 'tesdsa',
    },
    {
        id: '8',
        title: 'delapan',
    },
    {
        id: '9',
        title: 'SEMBILAN',
    },
  ];

  const Item = ({ title }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
export default function ListProduct({inputValue}) {
   const [isLoading, setLoading] = useState(true);
   const [data, setData] = useState([])
    
   
    useEffect(()=>{
        getUser();
        return ()=>{

        }
    },[])

    const getUser = ()=>{
        const urlDummy = 'https://jsonplaceholder.typicode.com/users';
        fetch(urlDummy)
        .then((res)=> res.json())
        .then((resJson)=>{
        setData(resJson)
        })
        .catch((err)=>{
        console.log(err);
        })
        .finally(()=>setLoading(false))
    }

    const renderItemgetUser = ({item, index})=>{
        return (
            <TouchableOpacity
                style={
                    styles.item,
                    {
                    marginTop: 11,
                    height:80,
                    backgroundColor:'#f9c2ff',
                }}
            >
               <Text style={styles.txtFontSize}>{item.username}</Text> 
            </TouchableOpacity>
        )
    }

  return (
    <View>
      <Text>ListProduct</Text>
       {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          renderItem={renderItemgetUser}
          keyExtractor={item => `${item.id}`}
        />
       )}
       <TouchableOpacity style={styles.wrapButton}>
            <Text style={styles.txtFontSize}>Scroll to item selected</Text>
       </TouchableOpacity>
    </View >
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
     
    },
    item: {
     borderWidth:0.5,
     padding:8,
     borderRadius:10,
     justifyContent:'center',
    },
    title: {
      fontSize: 16,
      color:'black'
    },
    wrapButton :{
        alignItem:'center',
        marginHorizontal : 50,
        padding: 20,
        backgroundColor:'orange',
    },
    txtFontSize:{
        fontSize:16,
        color:'black'
    }
  });
  