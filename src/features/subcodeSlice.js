import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getAllSubCodes, createSubCode, updateSubCode, 
        deleteSubCode } from "../services/subcode.service";

const initialState = {
    status: null,
    message: null,
    count: 0,
    subcodes: null,
    totalPages: 1,
    currentPage: 1,
    addCodeError: null,
    vendors: null,
    documents: null,
    perPage: null,
    multiCodeStatus: null,
    addStatus: null,
    updateCodeError: null,
    updateCodeStatus: null,
};

export const listSubCodesAsync = createAsyncThunk(
    'subcodes/list',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const {currentPage, searchQuery, selectedVendor, selectedDoc, perPage, order} = data;
            const response = await getAllSubCodes(currentPage, searchQuery, selectedVendor, selectedDoc, perPage, order);
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

export const addSubCodeAsync = createAsyncThunk(
    'subcodes/create',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await createSubCode(data);
            if (response.status === 200) {
                return response.data; 
            } else if(response.response.status === 400) {
                return rejectWithValue(response.response.data);
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
            } else if(response.code == 400) {
                return rejectWithValue(response.data);
            } else {
                return rejectWithValue(response.data);
            }
        } catch (error) {
            return rejectWithValue(error);
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
            state.currentPage = action.payload == 0 ? 1 : action.payload;
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
                state.updateCodeStatus = 'succeeded';
            })
            .addCase(updateSubCodeAsync.rejected, (state, action) => {
                state.updateCodeStatus = 'failed';
                if (action.payload) {
                    state.updateCodeError = action.payload;
                } else {
                    state.updateCodeError = action.error.message;
                }
            })
            .addCase(addSubCodeAsync.rejected, (state, action) => {
                state.addStatus = 'failed';
                if (action.payload) {
                    state.addCodeError = action.payload.data[0]['code_position'];
                } else {
                    state.addCodeError = action.error.message; // Fallback to action.error.message if payload is not available
                }
            })
            .addCase(addSubCodeAsync.fulfilled, (state, action) => {
                state.addStatus = 'success';
            })

    },
});

export const selectSubcodes = (state) => state.subcodes.subcodes;
export const { setCurrentPage, setTotalPages } = subcodeSlice.actions;
export const selectCurrentPage = state => state.subcodes.currentPage;
export const totalPages = (state) => state.subcodes.totalPages;
export const addError = (state) => state.subcodes.addCodeError;
export const selectStatus = (state) => state.subcodes.status;
export const allVendors = (state) => state.subcodes.vendors;
export const allDocuments = (state) => state.subcodes.documents;
export const count = (state) => state.subcodes.count;
export const addCodeStatus = (state) => state.subcodes.addStatus;
export const updateError = (state) => state.subcodes.updateCodeError;
export const updateStatus = (state) => state.subcodes.updateCodeStatus;
export default subcodeSlice.reducer;