import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getAllDocuments } from "../services/document.service";

const initialState = {
    status: null,
    message: null,
    count: 0,
    error: null,
    allDocuments: null
};

export const listDocAsync = createAsyncThunk(
    'doc/list',
    async (allDocument, { dispatch, rejectWithValue }) => {
        try {
            const response = await getAllDocuments(allDocument);
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

export const documentSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(listDocAsync.pending, (state) => { })
            .addCase(listDocAsync.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message; // Fallback to action.error.message if payload is not available
                }
            })
            .addCase(listDocAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.allDocuments = action.payload.data.results;  
            })
    },
});


export const allDocuments = (state) => state.documents.allDocuments;
export default documentSlice.reducer;