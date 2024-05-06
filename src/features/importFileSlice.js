import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadDocument, extractData, getformatData } from "../services/document.service";
import { createMultipleSubCode } from "../services/subcode.service";

const initialState = {
    status: null,
    message: null,
    error: null,
    documentData: null,
    multiCodeError: null,
    multiCodeStatus: null
};

export const uploadDocumentAsync = createAsyncThunk(
    'document/upload',
    async (file, { dispatch, rejectWithValue }) => {
        try {
            const response = await uploadDocument(file);
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

export const getExtractDataAsync = createAsyncThunk(
    'document/extract',
    async (doc_id, { dispatch, rejectWithValue }) => {
        try {
            const response = await extractData(doc_id);
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

export const formatDataAsync = createAsyncThunk(
    'document/formatdata',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await getformatData(data);
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

export const addMultipleCodeAsync = createAsyncThunk(
    'subcodes/multicreate',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await createMultipleSubCode(data);
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

const importFileSlice = createSlice({
    name: 'extractImportedData',
    initialState,
    reducers: {
        clearData: (state, action) => {
            state.formatedData = null;
            state.extractedData = null;
        },
        resetMultiCodeStatus: (state) => {
            state.multiCodeStatus = null;
            state.multiCodeError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadDocumentAsync.pending, (state) => { })
            .addCase(uploadDocumentAsync.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message; // Fallback to action.error.message if payload is not available
                }
            })
            .addCase(uploadDocumentAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.documentData = action.payload.data;
            })
            .addCase(getExtractDataAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.extractedData = action.payload.data;
            })
            .addCase(formatDataAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.formatedData = action.payload.data;
            })
            .addCase(addMultipleCodeAsync.rejected, (state, action) => {
                state.multiCodeStatus = 'failed';
                if (action.payload) {
                    state.multiCodeError = action.payload.message;
                } else {
                    state.multiCodeError = action.error.message; // Fallback to action.error.message if payload is not available
                }
            })
            .addCase(addMultipleCodeAsync.fulfilled, (state, action) => {
                state.multiCodeStatus = 'success';
            })
    },
});

export const { clearData, resetMultiCodeStatus } = importFileSlice.actions;
export const documentData = (state) => state.extractImportedData.documentData;
export const extractedData = (state) => state.extractImportedData.extractedData;
export const extractedStatus = (state) => state.extractImportedData.status;
export const formatedData = (state) => state.extractImportedData.formatedData;
export const multipleCodeStatus = (state) => state.extractImportedData.multiCodeStatus;
export const multiAddCodeError = (state) => state.extractImportedData.multiCodeError;
export default importFileSlice.reducer;