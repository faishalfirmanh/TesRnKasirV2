import {URL_API} from "@env";


export default url = {
    end_point_dev :  URL_API,
    
    url_login :'login',
    logout: 'logout-api',

    cek_last_struckId: "kasir/get-last-struck-id",
    
    generate:'kasir/generate-new-struck',
    url_search_product : 'product/product-list-jual-price-search',
    url_get_strukc_id : 'get-struck-id',

  
    create_chart : 'kasir/kerajang-create',
    delete_chart : 'kasir/delete-keranjang',

    remove_min_1 : 'kasir/remove-keranjang-product-min1',
    add_plus_1: 'kasir/add-keranjang-product-plus1',

    price_user_bayar : 'kasir/input-price-user-bayar',

    get_struck : 'kasir/get-view-struck-barang',
    
    get_product_jual_id : 'product/product-jual-byid'

}