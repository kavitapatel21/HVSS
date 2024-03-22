import API from '../services/api';

export const getAllDocuments = (allDocument) => {
    const auth = JSON.parse(localStorage.getItem('user'));
    const config = {
        headers: {
            'Authorization': `Bearer ${auth.access}`
        },
        params: {}
    };
    if (allDocument) {
        config.params.only_having_subcode = allDocument;
    }
    return API.get("upload-document", config)
        .then(response => { 
            return response; 
        },
        error => { 
            return error; 
        })
}

export const uploadDocument = (file) => {
    const auth = JSON.parse(localStorage.getItem('user'));
    return API.post("upload-document", file, {
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

export const extractData = (doc_id) => {
    const auth = JSON.parse(localStorage.getItem('user'));
    return API.get("document/"+ doc_id + "/extract_tables", {
        headers:{
            'Authorization': `Bearer ${auth.access}`,
        }
    })
    .then(response => { 
        return response; 
    },
    error => { 
        return error; 
    })
}

export const getformatData = (data) => {
    const auth = JSON.parse(localStorage.getItem('user'));
    const requestData = {
        selected_table_data: data,
    };
    const config = {
        headers: {
            'Authorization': `Bearer ${auth.access}`
        },
    };
    return API.post("format_table_with_gpt", requestData, config)
    .then(response => { 
        return response; 
    },
    error => { 
        return error; 
    })
}

