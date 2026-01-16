import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import categoriesRepository from "../repositories/categoryRepository";

// Async thunk to fetch categories
export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async ({ userId, startDate, endDate }) => {
    const categories = await categoriesRepository.getAll({
      userId,
      startDate,
      endDate,
    });
    return categories;
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default categoriesSlice.reducer;
