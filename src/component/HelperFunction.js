
export const convert_number_coma = (x) =>{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}