import API from '../services/api';
export const getAllSubCodes = (page, search, doc_id) => {
    const auth = JSON.parse(localStorage.getItem('user'));
    const config = {
        headers: {
            'Authorization': `Bearer ${auth.access}`
        },
        params: {
            page: page,
            search: search,
            page_size: 10
        },
    };
    if (doc_id) {
        config.params.document_id = doc_id;
    }
    return API.get("product_subcodes", config)
        .then(response => { 
            return response; 
        },
        error => { 
            return error; 
        })
}

export const createSubCode = (data) => {
    data.vendor_id = data.vendor_id.id;
    data.document_id = data.document_id.id;
    const auth = JSON.parse(localStorage.getItem('user'));

    return API.post("product_subcodes", [data], {
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


export const updateSubCode = (data) => {
    const auth = JSON.parse(localStorage.getItem('user'));
    data.vendor_id = data.vendor_id.id;
    data.document_id = data.document_id.id;
    return API.patch("product_subcodes/"+ data.id , data, {
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

export const getAllVendors = () => {
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

export const getAllDocuments = () => {
    const auth = JSON.parse(localStorage.getItem('user'));
    const config = {
        headers: {
            'Authorization': `Bearer ${auth.access}`
        },
    };
    return API.get("upload-document", config)
        .then(response => { 
            return response; 
        },
        error => { 
            return error; 
        })
}

export const deleteSubCode = (codeId) => {
    const auth = JSON.parse(localStorage.getItem('user'));
    const config = {
        headers: {
            'Authorization': `Bearer ${auth.access}`
        },
    };
    return API.delete("product_subcodes/"+ codeId, {
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