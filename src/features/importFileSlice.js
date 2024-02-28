import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { checkLoginAsync } from "../features/loginSlice";
import { uploadDocument, extractData, getformatData } from "../services/document.service";

const initialState = {
    status: null,
    message: null,
    error: null,
    documentData: null
};

export const uploadDocumentAsync = createAsyncThunk(
    'document/upload',
    async (file, { dispatch, rejectWithValue }) => {
        try {
            const response = await uploadDocument(file);
            if (response.status === 200) {
                return response.data; 
            } else if(response.response.status === 401) {
                const user = JSON.parse(localStorage.getItem('user'));
                const checkLoginResponse = await dispatch(checkLoginAsync(user.refresh));
                if (checkLoginResponse.payload) {
                    const check = await uploadDocument(file);
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

export const getExtractDataAsync = createAsyncThunk(
    'document/extract',
    async (doc_id, { dispatch, rejectWithValue }) => {
        try {
            const response = await extractData(doc_id);
            if (response.status === 200) {
                return response.data; 
            } else if(response.response.status === 401) {
                const user = JSON.parse(localStorage.getItem('user'));
                const checkLoginResponse = await dispatch(checkLoginAsync(user.refresh));
                if (checkLoginResponse.payload) {
                    const check = await extractData(doc_id);
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

export const formatDataAsync = createAsyncThunk(
    'document/formatdata',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await getformatData(data);
            if (response.status === 200) {
                return response.data; 
            } else if(response.response.status === 401) {
                const user = JSON.parse(localStorage.getItem('user'));
                const checkLoginResponse = await dispatch(checkLoginAsync(user.refresh));
                if (checkLoginResponse.payload) {
                    const check = await getformatData(data);
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

export const importFileSlice = createSlice({
    name: 'importfile',
    initialState,
    reducers: {},
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
                console.log(action.payload.data);
                state.formatedData = action.payload.data;
            })
    },
});

export const documentData = (state) => state.extractedData.documentData;
export const extractedData = (state) => state.extractedData.extractedData;
export const extractedStatus = (state) => state.extractedData.status;
export const formatedData = (state) => state.extractedData.formatedData;
export default importFileSlice.reducer;