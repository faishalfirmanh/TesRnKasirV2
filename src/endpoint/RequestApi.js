import axios from 'axios';

export const RequestApiPostWithToken = (url, param, token) => {
    const headers_config = { headers: {"Authorization" : `Bearer ${token}`}};
     return new Promise((resolved, reject)=>{
        axios.post(url, param, headers_config)
        .then(function (response) {
            resolved(response);
        })
        .catch(function (error,param2) {
            reject(error,param2);
        });
    })
}

export const RequestApiPostGenerate = (url, token) => {
    const headers_config = { headers: {"Authorization" : `Bearer ${token}`}};
    return new Promise((resolved, reject)=>{
        axios.post(url,{},headers_config)
        .then(function (response) {
            resolved(response);
        })
        .catch(function (error,param2) {
            reject(error,param2);
        });
    })
}