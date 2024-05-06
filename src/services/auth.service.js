import API from '../services/api';

export const login = (data) => {
    return API.post("login", data)
    .then(response => {
        return response;
    },
    error => {
        return error; 
    })
}

export const checkLogin = (token) => {
    const data = {
        'refresh_token' : token
    };
    return API.post("refresh-token", data)
    .then(response => {
        return response;
    },
    error => {
        return error; 
    })
}

export const loggedOut = (token) => {
    const data = {
        'refresh_token' : token
    };
    return API.post("logout", data)
    .then(response => {
        return response.data;
    },
    error => {
        return error; 
    })
}