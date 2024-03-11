import API from '../services/api';

export const getCodeDetails = (code) => {
    const auth = JSON.parse(localStorage.getItem('user'));
    console.log(code)
    const config = {
        headers: {
            'Authorization': `Bearer ${auth.access}`
        },
    };
    return API.get("product_specification/"+ code, config)
        .then(response => { 
            return response; 
        },
        error => { 
            return error; 
        })
}

export const uploadExcel = (file) => {
    const auth = JSON.parse(localStorage.getItem('user'));
    console.log(file);
    return API.post("download_excel", file, {
        headers:{
            'Authorization': `Bearer ${auth.access}`,
            'Content-Type': 'multipart/form-data',
        }
    })
    .then(response => { 
        return response; 
    },
    error => { 
        return error; 
    })
}