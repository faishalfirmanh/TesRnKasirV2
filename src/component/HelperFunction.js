
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