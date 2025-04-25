import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadFile, getFrequency, getProducts, updateFrequency, addProduct, 
    deleteProduct, getScrapingOn, getScrapingStatus, getProductDetails, getProductScrapDetails, 
    getUploadedFiles, getProdReport, getExportProd } from "../services/scraping.service";

const initialState = {
    status: null,
    error: null,
    details: null,
    uploadError: null,
    totalPages: 1,
    currentPage: 1,
    uploadStatus: null,
    successMessage: null,
    errorStatusMsg: null,
    scrapingStatus: null,
    scrapOnstatus: null,
    updateStatus: false,
    productStatus: false,
    productDetails: {},
    productScrapDetails: [],
    totalScrollPage: 1,
    currentScrollPage: 1,
    totalPages: 0,
    hasMore: true,
    page: 1,
    products: [],
    productpage: 1,
    downloadError: null,
    productReport: null,
    exportProducts: null,
    downloadProdError: null
};

export const uploadFileAsync = createAsyncThunk(
    'file/upload',
    async (file, { dispatch, rejectWithValue }) => {
        try {
            const response = await uploadFile(file);
            if (response.status === 200) {
                return response.data; 
            } else if(response.response.status === 400) {
                return rejectWithValue(response.response.data.data.error);
            } else {
                return rejectWithValue(response.response.data.data);
            }
        } catch (error) {
            return rejectWithValue(error.error);
        }
    }
);

export const getFreqAsync = createAsyncThunk(
    'scrape/frequency',
    async (arg, { dispatch, rejectWithValue }) => {
        try {
            const response = await getFrequency();
            if (response.status === 200) {
                return response.data; // If successful, return the response data
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateFreqAsync = createAsyncThunk(
    'scrape/frequency/update',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await updateFrequency(data);
            if (response.status === 200) {
                return response.data; // If successful, return the response data
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getProductsAsync = createAsyncThunk(
    'scrape/products',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const {getpage, searchQuery, selectedDoc, ordering} = data;
            const response = await getProducts(getpage, searchQuery, selectedDoc, ordering);
            if (response.status === 200) {
                return response.data; // If successful, return the response data
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getDocsAsync = createAsyncThunk(
    'scrape/documents',
    async (data = {}, { dispatch, rejectWithValue }) => {
        try {
            const {currentPage, perPage, order} = data;
            const response = await getUploadedFiles(currentPage, perPage, order);
            if (response.status === 200) {
                return response.data; // If successful, return the response data
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addProductAsync = createAsyncThunk(
    'add/product',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await addProduct(data);
            if (response.status === 200) {
                return response.data; // If successful, return the response data
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteProductAsync = createAsyncThunk(
    'delete/product',
    async (productId, { dispatch, rejectWithValue }) => {
        try {
            const response = await deleteProduct(productId);
            if (response.status === 200) {
                return response.data; // If successful, return the response data
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const handleScrapingAsync = createAsyncThunk(
    'scrape/now',
    async (arg, { dispatch, rejectWithValue }) => {
        try {
            const response = await getScrapingOn();
            console.log(response);
            if (response.status === 200) {
                return response.data; // If successful, return the response data
            } else if(response.response.status === 400) {
                console.log(response);
                return rejectWithValue(response.response.data.data.error);
            } else {
                return rejectWithValue(response.response.data.data);
            }
        } catch (error) {
            return rejectWithValue(error.response.data.data.error);
        }
    }
);

export const checkScrapStatus = createAsyncThunk(
    'scrape/status',
    async (arg, { dispatch, rejectWithValue }) => {
        try {
            const response = await getScrapingStatus();
            if (response.status === 200) {
                return response.data; // If successful, return the response data
            } else if(response.response.status === 400) {
                return rejectWithValue(response.response.data.data.error);
            } else {
                return rejectWithValue(response.response.data.data);
            }
        } catch (error) {
            return rejectWithValue(error.response.data.data.error);
        }
    }
);

export const productDetailsAsync = createAsyncThunk(
    'product/details',
    async (productId, { dispatch, rejectWithValue }) => {
        try {
            const response = await getProductDetails(productId);
            if (response.status === 200) {
                return response.data; // If successful, return the response data
            } else if(response.response.status === 400) {
                return rejectWithValue(response.response.data.data.error);
            } else {
                return rejectWithValue(response.response.data.data);
            }
        } catch (error) {
            return rejectWithValue(error.response.data.data.error);
        }
    }
);

export const productScrapDetailsAsync = createAsyncThunk(
    'product/scrap/details',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const {product_id, history_page_size, history_page} = data;
            const response = await getProductScrapDetails(product_id, history_page_size, history_page);
            if (response.status === 200) {
                return response.data; // If successful, return the response data
            } else if(response.response.status === 400) {
                return rejectWithValue(response.response.data.data.error);
            } else {
                return rejectWithValue(response.response.data.data);
            }
        } catch (error) {
            return rejectWithValue(error.response.data.data.error);
        }
    }
);

export const downloadProdReportAsync = createAsyncThunk(
    'product/details/download',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await getProdReport(productId);
            if (response) {
                return response; // If successful, return the response data
            }
        } catch (error) {
            console.log(error)
            return rejectWithValue(error.response.data.data.error);
        }
    }
);

export const getExportProducts = createAsyncThunk(
    'product/exportproducts',
    async (arg, { rejectWithValue }) => {
        try {
            const response = await getExportProd();
            if (response) {
                return response; // If successful, return the response data
            }
        } catch (error) {
            return rejectWithValue(error.response.data.data.error);
        }
    }
);

export const scrapingSlice = createSlice({
    name: 'scrapedetails',
    initialState,
    reducers: {
        setCurrentPage: (state, action) => { // Add a reducer to update the currentPage
            state.currentPage = action.payload == 0 ? 1 : action.payload;
        },
        setTotalPages: (state, action) => { // Assuming you also have a reducer for totalPages
            state.totalPages = action.payload.data.count;
        },
        setScrapStatus: (state, action) => {
            state.scrapingStatus = action.payload;
        },
        resetState: (state) => {
            state.updateStatus = false;
            state.successMessage = null;
            state.uploadError = null;
            state.productStatus = false;
            state.errorMsg = null;
            state.uploadStatus = null;
            // state.productScrapDetails = [];
        },
        clearScrapDetails: (state) => {
            state.productScrapDetails = [];
        },
        clearProductDetails: (state) => {
            state.productDetails = {};
        },
        clearProductReport: (state) => {
            state.productReport = null;
        },
        clearProductsData: (state) => {
            state.exportProducts = null;
        },
        setProductPage: (state, action) => { // Add a reducer to update the currentPage
            state.productpage = action.payload == 0 ? 1 : action.payload;
        },
        setCurrentScrollPage: (state, action) => { // Add a reducer to update the currentPage
            state.currentScrollPage = action.payload == 0 ? 1 : action.payload;
        },
        resetProducts: (state) => {
            state.products = [];
            state.productpage = 1;
            state.hasMore = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadFileAsync.rejected, (state, action) => {
                state.uploadStatus = 'failed';
                if (action.payload) {
                    state.uploadError = action.payload;
                } else {
                    state.uploadError = action.error.message; // Fallback to action.error.message if payload is not available
                }
            })
            .addCase(uploadFileAsync.fulfilled, (state, action) => {
                state.uploadStatus = 'succeeded';
            })
            .addCase(getFreqAsync.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message;
                }
            })
            .addCase(getFreqAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.frequencyData = action.payload.data;
            })
            .addCase(updateFreqAsync.rejected, (state, action) => {
                state.updateStatus = action.payload.status;
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message;
                }
            })
            .addCase(updateFreqAsync.fulfilled, (state, action) => {
                state.updateStatus = action.payload.status;
            })
            .addCase(getProductsAsync.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message;
                }
            })
            .addCase(getProductsAsync.fulfilled, (state, action) => {
                if (action.meta.arg.searchQuery) {
                    state.products = action.payload.data.results;
                    state.productpage = 1;
                } else {
                    state.products = state.productpage === 1 
                        ? action.payload.data.results 
                        : [...state.products, ...action.payload.data.results];
                }
                state.status = 'succeeded';
                state.totalPages = Math.ceil(action.payload.data.count / 20);
                state.hasMore = state.productpage < state.totalPages;
            })
            .addCase(addProductAsync.rejected, (state, action) => {
                state.productStatus = action.payload.status;
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message;
                }
            })
            .addCase(addProductAsync.fulfilled, (state, action) => {
                state.productStatus = action.payload.status;
            })
            .addCase(handleScrapingAsync.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    state.errorMsg = action.payload;
                } else {
                    state.errorMsg = action.error.message; 
                }
            })
            .addCase(handleScrapingAsync.fulfilled, (state, action) => {
                state.scrapOnstatus = 'succeeded';
                state.successMessage = action.payload.data.message;
            })
            .addCase(checkScrapStatus.rejected, (state, action) => {
                state.scrapOnstatus = 'failed';
                if (action.payload) {
                    state.errorMsg = action.payload;
                } else {
                    state.errorMsg = action.error.message; 
                }
            })
            .addCase(checkScrapStatus.fulfilled, (state, action) => {
                state.scrapOnstatus = 'succeeded';
                state.scrapingStatus = action.payload.data.is_running;
            })
            .addCase(productDetailsAsync.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    state.productErr = action.payload;
                } else {
                    state.productErr = action.error.message; 
                }
            })
            .addCase(productDetailsAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.productDetails = action.payload.data;
            })
            .addCase(productScrapDetailsAsync.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    state.productScrapErr = action.payload;
                } else {
                    state.productScrapErr = action.error.message; 
                }
            })
            .addCase(productScrapDetailsAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.hasNext = action.payload.data.next !== null ? true : false; 
                if (state.productScrapDetails && state.productScrapDetails.length > 0) {
                    state.productScrapDetails = [
                        ...state.productScrapDetails,
                        ...action.payload.data,
                    ];
                } else {
                    state.productScrapDetails = action.payload.data;
                }
                state.totalScrollPage = Math.ceil(action.payload.data.count / 20);
            })
            .addCase(getDocsAsync.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message;
                }
            })
            .addCase(getDocsAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.documents = action.payload.data.results;
                state.docCount = action.payload.data.count;
                state.docTotalPages = Math.ceil(action.payload.data.count / 10);
            })
            .addCase(downloadProdReportAsync.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    state.downloadError = action.payload.error;
                } else {
                    state.downloadError = action.error.message; 
                }
            })
            .addCase(downloadProdReportAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.productReport = action.payload;
            })
            .addCase(getExportProducts.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    state.downloadProdError = action.payload.error;
                } else {
                    state.downloadProdError = action.error.message; 
                }
            })
            .addCase(getExportProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.exportProducts = action.payload;
            })
    },
});

export default scrapingSlice.reducer;
export const { setCurrentPage, setTotalPages, setScrapStatus, resetState, 
    setCurrentScrollPage, setProductPage, resetProducts, clearProductReport, 
    clearScrapDetails, clearProductDetails, clearProductsData } = scrapingSlice.actions;
export const selectCurrentPage = state => state.scrapedetails.currentPage;
export const uploadFileStatus = (state) => state.scrapedetails.uploadStatus;
export const uploadFileError = (state) => state.scrapedetails.uploadError;
export const frequencyData = (state) => state.scrapedetails.frequencyData;
export const productsData = (state) => state.scrapedetails.products;
export const count = (state) => state.scrapedetails.count;
export const successStatusMsg = (state) => state.scrapedetails.successMessage;
export const errorStatusMsg = (state) => state.scrapedetails.errorMsg;
export const scrapingStatus = (state) => state.scrapedetails.scrapingStatus;
export const scrapOnstatus = (state) => state.scrapedetails.scrapOnstatus;
export const updateStatus = (state) => state.scrapedetails.updateStatus;
export const productStatus = (state) => state.scrapedetails.productStatus;
export const productDetails = (state) => state.scrapedetails.productDetails;
export const productScrapDetails = (state) => state.scrapedetails.productScrapDetails;
export const hasNextList = (state) => state.scrapedetails.hasNext;
export const documentsData = (state) => state.scrapedetails.documents;
export const docCount = (state) => state.scrapedetails.docCount;
export const docTotalPages = (state) => state.scrapedetails.docTotalPages;
export const totalScrollPage = (state) => state.scrapedetails.totalScrollPage;
export const page = (state) => state.scrapedetails.productpage;
export const hasmore = (state) => state.scrapedetails.hasMore;
export const productReport = (state) => state.scrapedetails.productReport;
export const downloadError = (state) => state.scrapedetails.downloadError;
export const exportProducts = (state) => state.scrapedetails.exportProducts;
export const downloadProdError = (state) => state.scrapedetails.downloadProdError;
