import API from './api';

export const getAllUsers = () => {
    const auth = JSON.parse(localStorage.getItem('user'));
    const config = {
        headers: {
            'Authorization': `Bearer ${auth.access}`
        },
    };
    return API.get("user", config)
        .then(response => { 
            return response; 
        },
        error => { 
            return error; 
        })
}

export const addUser = (data) => {
    const auth = JSON.parse(localStorage.getItem('user'));

    return API.post("user", data, {
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
    return API.patch("user/"+ data.id , data, {
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

export const deleteUser = (userId) => {
    const auth = JSON.parse(localStorage.getItem('user'));
    const config = {
        headers: {
            'Authorization': `Bearer ${auth.access}`
        },
    };
    return API.delete("user/"+ userId, {
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
