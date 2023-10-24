import AsyncStorage from '@react-native-community/async-storage';

export const convert_number_coma = (x) =>{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const date_now_wib = () => {
    const currentTimestamp = new Date(); //Date.now();
    return currentTimestamp;
}

export const convertNameProdcut = (name,iskg,subname,variant)=>{
    const is_kg = iskg == 0 ? 'pcs' : 'kg';
    const subName = subname != null ? subname : is_kg;
    const varName = variant != null ? variant : subName; //n
    return  `${name} | ${varName}`;

}

export const setStorageKey = async(valStorage)=>{
    try {
        let save = await AsyncStorage.setItem('keyLogin',`${valStorage}`);
        return save;
    } catch (error) {
        let errorNya = await AsyncStorage.setItem('keyLogin','null');
        return errorNya
    }
}

export const getStorgaeKey = async(keyStorage)=>{
    try {
        let get = await AsyncStorage.getItem(`${keyStorage}`);
        return get;
    } catch (error) {
        return 'null'
    }
}

