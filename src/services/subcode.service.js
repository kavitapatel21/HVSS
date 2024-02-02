import API from '../../services/api';

class SubCodeService {
    getAllSubCodes() {
        return API.get(API_URL + "product_subcodes", {
            headers:{
                'x-access-token': localStorage.getItem('token')
            }
        })
        .then(response => { 
            return response; 
        },
        error => { 
            return error.response.data; 
        })
    }

    getSubCode(id){
        return API.get(API_URL + "product_subcodes/"+ id , {
            headers:{
                'x-access-token': localStorage.getItem('token')
            }
        })
        .then(response => { 
            return response; 
        },
        error => { 
            return error.response.data; 
        })
    }

    createSubCode(code){
        return API.post(API_URL + "product_subcodes/", {
            headers:{
                'x-access-token': localStorage.getItem('token')
            }
        })
        .then(response => { 
            return response; 
        },
        error => { 
            return error.response.data; 
        })
    }

    updateSubCode(id){
        return API.patch(API_URL + "product_subcodes/" + id, {
            headers:{
                'x-access-token': localStorage.getItem('token')
            }
        })
        .then(response => { 
            return response; 
        },
        error => { 
            return error.response.data; 
        })
    }



}

export default new SubCodeService();