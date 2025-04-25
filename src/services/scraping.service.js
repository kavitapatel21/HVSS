import API from '../services/api';

export const uploadFile = (file) => {
    const auth = JSON.parse(localStorage.getItem('user'));
    return API.post("scraping_documents", file, {
        headers:{
            'Authorization': `Bearer ${auth.access}`,
            'Content-Type': 'multipart/form-data',
        }
    })
    .then(response => {
        return response;
    })
    .catch(error => {
        return Promise.reject(error);
    });
}

export const getUploadedFiles = (page, per_page, order) => {
    const auth = JSON.parse(localStorage.getItem('user'));
    const config = {
        headers: {
            'Authorization': `Bearer ${auth.access}`
        },
        params: {
            page: page,
        }
    };
    if (per_page) {
        config.params.page_size = per_page;
    } else {
        config.params.page_size = 10;
    }
    if (order) {
        config.params.ordering = order;
    }

    return API.get("scraping_documents", config)
    .then(response => { 
        if (response.status == 200) {
            return response;
        } else {
            return Promise.reject(response);
        }
    })
    .catch(error => {
        return Promise.reject(error);
    });
    
}

export const getFrequency = () => {
    const auth = JSON.parse(localStorage.getItem('user'));
    const config = {
        headers: {
            'Authorization': `Bearer ${auth.access}`
        },
    };
    return API.get("task-schedule", config)
        .then(response => { 
            if (response.status == 200) {
                return response;
            } else {
                return Promise.reject(response);
            }
        })
        .catch(error => {
            return Promise.reject(error);
        });
}

export const updateFrequency = (data) => {
    const auth = JSON.parse(localStorage.getItem('user'));
    const config = {
        headers: {
            'Authorization': `Bearer ${auth.access}`
        },
    };
    return API.put("task-schedule", data, config)
        .then(response => { 
            if (response.status == 200) {
                return response;
            } else {
                return Promise.reject(response);
            }
        })
        .catch(error => {
            return Promise.reject(error);
        });
}

export const getProducts = (page, search, doc, order) => {
    const auth = JSON.parse(localStorage.getItem('user'));
    const config = {
        headers: {
            'Authorization': `Bearer ${auth.access}`
        },
        params: {
            params: {}
        }
    };
    // if (per_page) {
    //     config.params.page_size = per_page;
    // } else {
    //     config.params.page_size = 10;
    // }
    if (order) {
        config.params.ordering = order;
    }
    if (search) {
        config.params.search = search;
    } else {
        config.params.page = page;
    }
    if (doc != 0) {
        config.params.source_file_id = doc;
    }
    return API.get("products", config)
        .then(response => { 
            if (response.status == 200) {
                return response;
            } else {
                return Promise.reject(response);
            }
        })
        .catch(error => {
            return Promise.reject(error);
        });
}

export const addProduct = (data) => {
    const auth = JSON.parse(localStorage.getItem('user'));
    const config = {
        headers: {
            'Authorization': `Bearer ${auth.access}`
        }
    };
    return API.post("products", data, config)
        .then(response => { 
            if (response.status == 200) {
                return response;
            } else {
                return Promise.reject(response);
            }
        })
        .catch(error => {
            return Promise.reject(error);
        });
}

export const deleteProduct = (productId) => {
    const auth = JSON.parse(localStorage.getItem('user'));
    const config = {
        headers: {
            'Authorization': `Bearer ${auth.access}`
        }
    };
    return API.delete("products/" + productId, config)
        .then(response => { 
            if (response.status == 200) {
                return response;
            } else {
                return Promise.reject(response);
            }
        })
        .catch(error => {
            return Promise.reject(error);
        });
}

export const getScrapingOn = () => {
    const auth = JSON.parse(localStorage.getItem('user'));
    const config = {
        headers: {
            'Authorization': `Bearer ${auth.access}`
        },
    };
    return API.get("scrap_now", config)
        .then(response => { 
            if (response.status == 200) {
                return response;
            } else {
                return Promise.reject(response);
            }
        })
        .catch(error => {
            return Promise.reject(error);
        });
}

export const getScrapingStatus = () => {
    const auth = JSON.parse(localStorage.getItem('user'));
    const config = {
        headers: {
            'Authorization': `Bearer ${auth.access}`
        },
    };
    return API.get("task-status", config)
        .then(response => { 
            if (response.status == 200) {
                return response;
            } else {
                return Promise.reject(response);
            }
        })
        .catch(error => {
            return Promise.reject(error);
        });
}

export const getProductDetails = (productId) => {
    const auth = JSON.parse(localStorage.getItem('user'));
    const config = {
        headers: {
            'Authorization': `Bearer ${auth.access}`
        },
    };
    return API.get("search-results/" + productId, config)
        .then(response => { 
            if (response.status == 200) {
                return response;
            } else {
                return Promise.reject(response);
            }
        })
        .catch(error => {
            return Promise.reject(error);
        });
}

export const getProductScrapDetails = (productId, history_page_size, history_page) => {
    const auth = JSON.parse(localStorage.getItem('user'));
    const config = {
        headers: {
            'Authorization': `Bearer ${auth.access}`
        },
        params: {
            product_id: productId
        }
    };
    if (history_page_size) {
        config.params.history_page_size = history_page_size;
    }
    if (history_page) {
        config.params.history_page = history_page;
    }
    return API.get("search-results", config)
        .then(response => { 
            if (response.status == 200) {
                return response;
            } else {
                return Promise.reject(response);
            }
        })
        .catch(error => {
            return Promise.reject(error);
        });
}

export const getProdReport = (productId) => {
    const auth = JSON.parse(localStorage.getItem('user'));
    const config = {
        responseType: 'blob',
        headers: {
            'Authorization': `Bearer ${auth.access}`
        },
    };
    return API.get("price_history_report/" + productId, config)
        .then(response => {
            if (response.status == 200) {
                return response.data;
            }
        })
        .catch(error => {
            return Promise.reject(error);
        })
}

export const getExportProd = () => {
    const auth = JSON.parse(localStorage.getItem('user'));
    const config = {
        responseType: 'blob',
        headers: {
            'Authorization': `Bearer ${auth.access}`
        },
    };
    return API.get("export_products", config)
        .then(response => {
            if (response.status == 200) {
                return response.data;
            }
        })
        .catch(error => {
            return Promise.reject(error);
        })
}