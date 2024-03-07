import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { login, checkLogin } from "../services/auth.service";

export const loginAsync = createAsyncThunk(
    'login/login',
    async (data, { rejectWithValue }) => {
        try {
            const response = await login(data);
            if (response.status === 200) {
                return response.data; // If successful, return the response data
            } else if(response.response.status === 401) {
                return rejectWithValue(response.response.data.data.detail);
            } else {
                return rejectWithValue(response);
            }
        } catch (err) {
            return rejectWithValue(err.message); // Use rejectWithValue to dispatch rejected action
        }
    }
);

export const checkLoginAsync = createAsyncThunk(
    'auth/checkLogin',
    async (refreshToken, { rejectWithValue }) => {
      try {
        const response = await checkLogin(refreshToken);
        if (response.status === 200) {
            const user = JSON.parse(localStorage.getItem('user'));
            user.access = response.data.data.access_token;
            localStorage.setItem('user', JSON.stringify(user));
            return response.data;
        } else {
          return rejectWithValue(response.data); 
        }
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
);

export const loginSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        status: 'idle', // Initialize status field
        error: null,    // Initialize error field
        isLoggedIn: false,
    },
    reducers: {
        loggedIn: (state) => {
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.isLoggedIn = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    state.error = action.payload ? action.payload : action.payload.message;
                } else {
                    state.error = action.error.message; // Fallback to action.error.message if payload is not available
                }
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                if(action.payload) {
                    let user = action.payload.data;
                    localStorage.setItem('user', JSON.stringify(user));
                    localStorage.setItem('token', user.accessToken);
                    state.token = user.token;
                    state.isLoggedIn = true;
                }
            });
    },
});

export const { loginForm } = loginSlice.actions;

export const selectStatus = (state) => state.user.status;
export const getError = (state) => state.user.error;
export const selectUser = (state) => state.user.user;
export const { loggedIn, logout } = loginSlice.actions;
export const selectIsLoggedIn = (state) => state.user.isLoggedIn;
export default loginSlice.reducer;