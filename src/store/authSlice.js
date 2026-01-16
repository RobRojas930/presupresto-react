import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import AuthRepository from '../repositories/authRepository';

// Leer autenticación desde localStorage
const getInitialAuth = () => {
    const isAuth = localStorage.getItem('user');
    return isAuth !== null;
};

const initialState = {
    user: null,
    token: null,
    loading: false,
    error: null,
    isAuthenticated: getInitialAuth(),
};


export const login = createAsyncThunk(
    'user/login',
    async ({ email, password }, thunkAPI) => {
        try {
            const data = await AuthRepository.login(email, password);
            return data; // data puede ser el usuario o token
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart(state) {
            state.loading = true;
            state.error = null;
        },
        loginSuccess(state, action) {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.error = null;
        },
        loginFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        },
        logout(state) {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            state.loading = false;
            localStorage.removeItem('user');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload;
                state.loading = false;
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.isAuthenticated = false;
                localStorage.removeItem('user');
            });
    },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;