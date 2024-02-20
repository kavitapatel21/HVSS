import API from './api';

export const getAllUsers = () => {
    const auth = JSON.parse(localStorage.getItem('user'));
    const config = {
        headers: {
            'Authorization': `Bearer ${auth.access}`
        },
    };
    return API.get("vendor", config)
        .then(response => { 
            return response; 
        },
        error => { 
            return error; 
        })
}

export const addUser = (data) => {
    const auth = JSON.parse(localStorage.getItem('user'));

    return API.post("vendor", data, {
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

export const updateUser = (data) => {
    const auth = JSON.parse(localStorage.getItem('user'));
    return API.patch("vendor/"+ data.id , data, {
        headers:{
            'Authorization': `Bearer ${auth.access}`
        }
    })
    .then(response => { 
        return response; 
    },
    error => { 
        return error.response.data; 
    })
}

export const deleteUser = (vendorId) => {
    const auth = JSON.parse(localStorage.getItem('user'));
    const config = {
        headers: {
            'Authorization': `Bearer ${auth.access}`
        },
    };
    return API.delete("vendor/"+ vendorId, {
        headers:{
            'Authorization': `Bearer ${auth.access}`
        }
    })
    .then(response => { 
        return response; 
    },
    error => { 
        return error.response.data; 
    })
}
