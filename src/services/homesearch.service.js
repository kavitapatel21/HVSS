import API from '../services/api';

export const getCodeDetails = (code) => {
    const auth = JSON.parse(localStorage.getItem('user'));
    const data = {
        model_code: code
    };
    return API.post("product_specification", data, {
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

export const uploadExcel = (file) => {
    const auth = JSON.parse(localStorage.getItem('user'));
    return API.post("import_model_code_file", file, {
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

export const getImportFileStatus = (data) => {
    const auth = JSON.parse(localStorage.getItem('user'));
    const config = {
        headers: {
            'Authorization': `Bearer ${auth.access}`
        },
    };
    return API.get('import_model_code_file', config)
    .then(response => { 
        return response; 
    },
    error => { 
        return error; 
    })
}

export const getFileDownload = (id) => {
    const auth = JSON.parse(localStorage.getItem('user'));
    const config = {
        headers: {
            'Authorization': `Bearer ${auth.access}`
        },
    };
    const bodyData = {
        status : 'Downloaded'
    };
    return API.patch('export_excel/'+id, bodyData, config)
    .then(response => { 
        return response; 
    },
    error => { 
        return error; 
    })
}