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