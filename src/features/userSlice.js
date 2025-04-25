import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getAllUsers, addUser, updateUser, deleteUser } from "../services/user.service";

const initialState = {
    status: null,
    message: null,
    count: 0,
    error: null,
    users: null,
    currentPage: 1,
};

export const listUsersAsync = createAsyncThunk(
    'user/list',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const {currentPage, perPage} = data;
            const response = await getAllUsers(currentPage, perPage);
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

export const addUserAsync = createAsyncThunk(
    'user/add',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await addUser(data);
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

export const updateUserAsync = createAsyncThunk(
    'user/update',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await updateUser(data);
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
                state.count = action.payload.data.count;
            })
    },
});

export default userSlice.reducer;
export const { setCurrentPage, setTotalPages } = userSlice.actions;
export const selectUsers = (state) => state.users.users;
export const selectCurrentPage = state => state.users.currentPage;
export const count = (state) => state.users.count;