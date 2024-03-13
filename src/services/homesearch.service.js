import API from '../services/api';

export const getCodeDetails = (code) => {
    const auth = JSON.parse(localStorage.getItem('user'));
    const data = {
        model_code: code
    };
    return API.post("product_specification", data, {
        headers:{
            'Authorization': `Bearer ${auth.access}`
        }
    })
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