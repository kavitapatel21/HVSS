import API from '../services/api';

class AuthService {
    login(username, password) {
        return API.post("login", {
            username,
            password
        })
        .then(response => {
            if (response.data.accessToken) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }
            return response.data;
        },
        error => { 
            return error.response.data; 
        })
        
    }

    logout(){
        localStorage.removeItem("user");
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem("user"));
    }
}

export default new AuthService();