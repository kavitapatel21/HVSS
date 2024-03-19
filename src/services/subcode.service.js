import API from '../services/api';
export const getAllSubCodes = (page, search, vendor_id, doc_id, per_page, order) => {
    const auth = JSON.parse(localStorage.getItem('user'));
    const config = {
        headers: {
            'Authorization': `Bearer ${auth.access}`
        },
        params: {
            page: page,
            search: search,
        },
    };
    if (doc_id && doc_id != 0) {
        config.params.document_id = doc_id;
    }
    if (vendor_id && vendor_id != 0) {
        config.params.vendor_id = vendor_id;
    }
    if (per_page) {
        config.params.page_size = per_page;
    } else {
        config.params.page_size = 10;
    }
    if (order) {
        config.params.ordering = order;
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

export const createMultipleSubCode = (data) => {
    const auth = JSON.parse(localStorage.getItem('user'));

    return API.post("product_subcodes", data, {
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