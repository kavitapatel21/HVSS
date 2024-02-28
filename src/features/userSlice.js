import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getAllUsers, addUser, updateUser, deleteUser } from "../services/user.service";
import { checkLoginAsync } from "./loginSlice";

const initialState = {
    status: null,
    message: null,
    count: 0,
    error: null,
    users: null
};

export const listUsersAsync = createAsyncThunk(
    'user/list',
    async (arg, { dispatch, rejectWithValue }) => {
        try {
            const response = await getAllUsers();
            if (response.status === 200) {
                return response.data; // If successful, return the response data
            } else if(response.response.status === 401) {
                const user = JSON.parse(localStorage.getItem('user'));
                const checkLoginResponse = await dispatch(checkLoginAsync(user.refresh));
                if (checkLoginResponse.payload) {
                    const check = await getAllUsers();
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

export const addUserAsync = createAsyncThunk(
    'user/add',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await addUser(data);
            if (response.status === 200) {
                return response.data; // If successful, return the response data
            } else if(response.response.status === 401) {
                const user = JSON.parse(localStorage.getItem('user'));
                const checkLoginResponse = await dispatch(checkLoginAsync(user.refresh));
                if (checkLoginResponse.payload) {
                    const check = await addUser(data);
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

export const updateUserAsync = createAsyncThunk(
    'user/update',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await updateUser(data);
            if (response.status === 200) {
                return response.data; 
            } else if(response.response.status === 401) {
                const user = JSON.parse(localStorage.getItem('user'));
                const checkLoginResponse = await dispatch(checkLoginAsync(user.refresh));
                if (checkLoginResponse.payload) {
                    const check = await updateUser(data);
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

export const deleteUserAsync = createAsyncThunk(
    'user/delete',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await deleteUser(userId);
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

export const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(listUsersAsync.pending, (state) => { })
            .addCase(listUsersAsync.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message; // Fallback to action.error.message if payload is not available
                }
            })
            .addCase(listUsersAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload.data.results;
            })
    },
});


export const selectUsers = (state) => state.users.users;
export default userSlice.reducer;