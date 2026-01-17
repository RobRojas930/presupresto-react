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
    return categories.data;
  },
);

export const fetchCategoryById = createAsyncThunk(
  "categories/fetchById",
  async ({ id }) => {
    const categories = await categoriesRepository.getById(id);
    return categories.data;
  },
);

export const fetchCreateCategory = createAsyncThunk(
  "categories/fetchCreateCategory",
  async (categoryData, thunkAPI) => {
    try {
      const newCategory =
        await categoriesRepository.create(categoryData);
      return newCategory;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const fetchUpdateCategory = createAsyncThunk(
  "categories/fetchUpdateCategory",
  async ({ id, categoryData }, thunkAPI) => {
    try {
      const updateCategory = await categoriesRepository.update(
        id,
        categoryData,
      );
      return updateCategory.actualizado;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const fetchDeleteCategory = createAsyncThunk(
  "categories/fetchDeleteCategory",
  async ({ id }, thunkAPI) => {
    try {
      await categoriesRepository.delete(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
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
