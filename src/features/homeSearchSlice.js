import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCodeDetails, uploadExcel } from "../services/homesearch.service";
import { checkLoginAsync } from "../features/loginSlice";

const initialState = {
    status: null,
    error: null,
    details: null,
    document: null,
    excelError: null,
};

export const getCodeDetailsAsync = createAsyncThunk(
    'code/details',
    async (code, { dispatch, rejectWithValue }) => {
        try {
            const response = await getCodeDetails(code);
            
            if (response.status === 200) {
                return response.data; // If successful, return the response data
            } else if(response.response.status === 401) {
                const user = JSON.parse(localStorage.getItem('user'));
                const checkLoginResponse = await dispatch(checkLoginAsync(user.refresh));
                if (checkLoginResponse.payload) {
                    const check = await getCodeDetails(code);
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

export const uploadExcelAsync = createAsyncThunk(
    'file/upload',
    async (file, { dispatch, rejectWithValue }) => {
        try {
            const response = await uploadExcel(file);
            if (response.status === 200) {
                return response.data; 
            } else if(response.response.status === 401) {
                const user = JSON.parse(localStorage.getItem('user'));
                const checkLoginResponse = await dispatch(checkLoginAsync(user.refresh));
                if (checkLoginResponse.payload) {
                    const check = await uploadExcel(file);
                    return check.data;
                } else {
                    return rejectWithValue(checkLoginResponse.error);
                }
            }  else if(response.response.status === 400) {
                return rejectWithValue(response.response.data.error);
            } else {
                return rejectWithValue(response);
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const subcodeSlice = createSlice({
    name: 'codeDetails',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCodeDetailsAsync.pending, (state) => { })
            .addCase(getCodeDetailsAsync.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message; // Fallback to action.error.message if payload is not available
                }
            })
            .addCase(getCodeDetailsAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                if (action.payload.data) {
                    state.details = action.payload.data.code_breakdown;
                    state.error = action.payload.data.error;
                }
            })
            .addCase(uploadExcelAsync.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    state.excelError = action.payload;
                } else {
                    state.excelError = action.error.message; // Fallback to action.error.message if payload is not available
                }
            })
            .addCase(uploadExcelAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.document = action.payload;
            })
    },
});

export const codedetails = (state) => state.codeDetails.details;
export const codeError = (state) => state.codeDetails.error;
export const responseExcel = (state) => state.codeDetails.document;
export const responseExcelError = (state) => state.codeDetails.excelError;
export default subcodeSlice.reducer;