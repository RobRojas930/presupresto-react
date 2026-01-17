import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import budgetRepository from "../repositories/budgetRepository";

// Thunks para CRUD
export const fetchBudgets = createAsyncThunk(
  "budget/fetchBudgets",
  async (_, thunkAPI) => {
    try {
      const budgets = await budgetRepository.getBudgets(_);
      return budgets.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchBudgetById = createAsyncThunk(
  "budget/fetchBudgetById",
  async ({ id }, thunkAPI) => {
    try {
      const budgets = await budgetRepository.getBudgetById(id);
      return budgets.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchCreateBudget = createAsyncThunk(
  "budget/fetchCreateBudget",
  async (budgetData, thunkAPI) => {
    try {
      const newBudget = await budgetRepository.createBudget(budgetData);
      return newBudget;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchUpdateBudget = createAsyncThunk(
  "budget/fetchUpdateBudget",
  async ({ id, budgetData }, thunkAPI) => {
    try {
      const updatedBudget = await budgetRepository.updateBudget(id, budgetData);
      return updatedBudget.actualizado;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchDeleteBudget = createAsyncThunk(
  "budget/fetchDeleteBudget",
  async ({ id }, thunkAPI) => {
    try {
      await budgetRepository.deleteBudget(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const budgetSlice = createSlice({
  name: "budget",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(fetchCreateBudget.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(fetchCreateBudget.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update
      .addCase(fetchUpdateBudget.fulfilled, (state, action) => {
        const index = state.items.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(fetchUpdateBudget.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete
      .addCase(fetchDeleteBudget.fulfilled, (state, action) => {
        state.items = state.items.filter((b) => b.id !== action.payload);
      })
      .addCase(fetchDeleteBudget.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default budgetSlice.reducer;
