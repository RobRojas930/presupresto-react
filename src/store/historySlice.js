import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import historyRepository from '../repositories/historyRepository';

// Async thunk para obtener los datos del historial
export const getHistoryData = createAsyncThunk(
    'history/getHistoryData',
    async (_, { rejectWithValue }) => {
        try {
            const data = await historyRepository.fetchHistory(_);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.message || 'Error al obtener historial');
        }
    }
);

const historySlice = createSlice({
    name: 'history',
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getHistoryData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getHistoryData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getHistoryData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default historySlice.reducer;