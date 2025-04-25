import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getAllVendors, addVendor, updateVendor, deleteVendor, listAllVendors } from "../services/vendor.service";

const initialState = {
    status: null,
    message: null,
    count: 0,
    error: null,
    vendors: null,
    currentPage: 1,
    vendorsAll: null,
};

export const listVendorsAsync = createAsyncThunk(
    'vendor/list',
    async (allvendor, { dispatch, rejectWithValue }) => {
        try {
            const response = await getAllVendors(allvendor);
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

export const listAllVendorsAsync = createAsyncThunk(
    'vendor/get',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const {currentPage, perPage} = data;
            const response = await listAllVendors(currentPage, perPage);
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

export const addVendorAsync = createAsyncThunk(
    'vendor/add',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await addVendor(data);
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

export const updateVendorAsync = createAsyncThunk(
    'user/update',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await updateVendor(data);
            if (response.status === 200) {
                return response.data; 
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteVendorAsync = createAsyncThunk(
    'vendor/delete',
    async (vendorId, { rejectWithValue }) => {
        try {
            const response = await deleteVendor(vendorId);
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

export const vendorSlice = createSlice({
    name: 'vendors',
    initialState,
    reducers: {
        setCurrentPage: (state, action) => {
            console.log(action)
            state.currentPage = action.payload == 0 ? 1 : action.payload;
        },
        setTotalPages: (state, action) => {
            state.totalPages = action.payload.data.count;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(listVendorsAsync.pending, (state) => { })
            .addCase(listVendorsAsync.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message; // Fallback to action.error.message if payload is not available
                }
            })
            .addCase(listVendorsAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.vendors = action.payload.data.results;
                state.count = action.payload.data.count;
            })
            .addCase(listAllVendorsAsync.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message; // Fallback to action.error.message if payload is not available
                }
            })
            .addCase(listAllVendorsAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.vendorsAll = action.payload.data.results;
                state.count = action.payload.data.count;
            })
    },
});

export default vendorSlice.reducer;
export const { setCurrentPage, setTotalPages } = vendorSlice.actions;
export const allVendors = (state) => state.vendors.vendors;
export const vendorsList = (state) => state.vendors.vendorsAll;
export const selectCurrentPage = state => state.vendors.currentPage;
export const count = (state) => state.vendors.count;