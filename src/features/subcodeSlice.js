import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getAllSubCodes, createSubCode, updateSubCode, getAllVendors, 
    getAllDocuments, deleteSubCode } from "../services/subcode.service";
import { checkLoginAsync } from "../features/loginSlice";

const initialState = {
    status: null,
    message: null,
    count: 0,
    subcodes: null,
    totalPages: 1,
    currentPage: 1,
    error: null,
    vendors: null,
    documents: null,
    perPage: null
};

export const listSubCodesAsync = createAsyncThunk(
    'subcodes/list',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const {currentPage, searchQuery, selectedVendor, selectedDoc, perPage, order} = data;
            const response = await getAllSubCodes(currentPage, searchQuery, selectedVendor, selectedDoc, perPage, order);
            if (response.status === 200) {
                return response.data; // If successful, return the response data
            } else if(response.response.status === 401) {
                const user = JSON.parse(localStorage.getItem('user'));
                const checkLoginResponse = await dispatch(checkLoginAsync(user.refresh));
                if (checkLoginResponse.payload) {
                    const check = await getAllSubCodes(currentPage, searchQuery, selectedVendor, selectedDoc, perPage, order);
                    return check.data;
                } else {
                    return rejectWithValue(checkLoginResponse.error);
                }
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addSubCodeAsync = createAsyncThunk(
    'subcodes/create',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await createSubCode(data);
            if (response.status === 200) {
                return response.data; 
            } else if(response.response.status === 401) {
                const user = JSON.parse(localStorage.getItem('user'));
                const checkLoginResponse = await dispatch(checkLoginAsync(user.refresh));
                if (checkLoginResponse.payload) {
                    const check = await createSubCode(data);
                    return check.data;
                } else {
                    return rejectWithValue(checkLoginResponse.error);
                }
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateSubCodeAsync = createAsyncThunk(
    'subcodes/post',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await updateSubCode(data);
            if (response.status === 200) {
                return response.data; 
            } else if(response.response.status === 401) {
                const user = JSON.parse(localStorage.getItem('user'));
                const checkLoginResponse = await dispatch(checkLoginAsync(user.refresh));
                if (checkLoginResponse.payload) {
                    const check = await updateSubCode(data);
                    return check.data;
                } else {
                    return rejectWithValue(checkLoginResponse.error);
                }
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteSubCodeAsync = createAsyncThunk(
    'subcodes/delete',
    async (codeId, { dispatch, rejectWithValue }) => {
        try {
            const response = await deleteSubCode(codeId);
            if (response.status === 200) {
                return response.data; // If successful, return the response data
            } else if(response.response.status === 401) {
                const user = JSON.parse(localStorage.getItem('user'));
                const checkLoginResponse = await dispatch(checkLoginAsync(user.refresh));
                if (checkLoginResponse.payload) {
                    const check = await deleteSubCode(codeId);
                    return check.data;
                } else {
                    return rejectWithValue(checkLoginResponse.error);
                }
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const listVendorAsync = createAsyncThunk(
    'vendor/list',
    async (arg, { dispatch, rejectWithValue }) => {
        try {
            const response = await getAllVendors();
            if (response.status === 200) {
                return response.data; // If successful, return the response data
            } else if(response.response.status === 401) {
                const user = JSON.parse(localStorage.getItem('user'));
                const checkLoginResponse = await dispatch(checkLoginAsync(user.refresh));
                if (checkLoginResponse.payload) {
                    const check = await getAllVendors();
                    return check.data;
                } else {
                    return rejectWithValue(checkLoginResponse.error);
                }
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


export const listDocAsync = createAsyncThunk(
    'doc/list',
    async (arg, { dispatch, rejectWithValue }) => {
        try {
            const response = await getAllDocuments();
            if (response.status === 200) {
                return response.data; // If successful, return the response data
            } else if(response.response.status === 401) {
                const user = JSON.parse(localStorage.getItem('user'));
                const checkLoginResponse = await dispatch(checkLoginAsync(user.refresh));
                if (checkLoginResponse.payload) {
                    const check = await getAllDocuments();
                    return check.data;
                } else {
                    return rejectWithValue(checkLoginResponse.error);
                }
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


export const subcodeSlice = createSlice({
    name: 'subcodes',
    initialState,
    reducers: {
        setCurrentPage: (state, action) => { // Add a reducer to update the currentPage
            state.currentPage = 1;
        },
        setTotalPages: (state, action) => { // Assuming you also have a reducer for totalPages
            state.totalPages = action.payload.data.count;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(listSubCodesAsync.pending, (state) => { })
            .addCase(listSubCodesAsync.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message; // Fallback to action.error.message if payload is not available
                }
            })
            .addCase(listSubCodesAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.subcodes = action.payload.data.results;
                const data = state.subcodes.map(item => ({
                    ...item,
                    description: item.description.replace(/\u00a0/g, ''),
                  }));
                state.count = action.payload.data.count;
                state.totalPages = Math.ceil(action.payload.data.count / 10);
            })
            .addCase(updateSubCodeAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(listVendorAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.vendors = action.payload.data.results;
            })
            .addCase(listDocAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.documents = action.payload.data.results;  
            })
    },
});

export const selectSubcodes = (state) => state.subcodes.subcodes;
export const { setCurrentPage, setTotalPages } = subcodeSlice.actions;
export const selectCurrentPage = state => state.subcodes.currentPage;
export const totalPages = (state) => state.subcodes.totalPages;
export const getError = (state) => state.subcodes.error;
export const selectStatus = (state) => state.subcodes.status;
export const allVendors = (state) => state.subcodes.vendors;
export const allDocuments = (state) => state.subcodes.documents;
export const count = (state) => state.subcodes.count;
export default subcodeSlice.reducer;