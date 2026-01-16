import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
// Ejemplo de slice básico
import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
    name: 'app',
    initialState: { value: 'Presupresto' },
    reducers: {
        setValue: (state, action) => {
            state.value = action.payload;
        },
    },
});

export const { setValue } = appSlice.actions;

const store = configureStore({
    reducer: {
        app: appSlice.reducer,
        auth: authReducer,
    },
});

export default store;
