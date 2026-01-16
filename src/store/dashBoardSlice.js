import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_URL } from '../utils/constants';
import dashBoardRepository from '../repositories/dashBoardRepository';
// Async thunk para cargar datos del dashboard
export const fetchDashboardData = createAsyncThunk(
    'user/dashboard',
    async (_, thunkAPI) => {
        try {
            const user = localStorage.getItem('user');
            if (user !== null) {
                return await dashBoardRepository.getDashboardData();
            } else {
                return thunkAPI.rejectWithValue('Usuario no autenticado');
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const dashBoardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default dashBoardSlice.reducer;