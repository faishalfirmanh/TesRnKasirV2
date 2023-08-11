
export const convert_number_coma = (x) =>{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const date_now_wib = () => {
    const currentTimestamp = new Date(); //Date.now();
    return currentTimestamp;
}