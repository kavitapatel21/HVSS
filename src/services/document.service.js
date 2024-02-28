import API from '../services/api';

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
    return API.get("document/63/extract_tables", {
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

export const formatData = (data) => {
    const auth = JSON.parse(localStorage.getItem('user'));
    const config = {
        headers: {
            'Authorization': `Bearer ${auth.access}`
        },
        params: {
            selected_table_data: data,
        },
    };
    return API.post("format_table_with_gpt", config)
    .then(response => { 
        return response; 
    },
    error => { 
        return error; 
    })
}

