import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import transactionRepository from "../repositories/transacctionRepository";

const initialState = {
  transactions: [],
  loading: false,
  error: null,
};
export const fetchTransactions   = createAsyncThunk(
  "transactions/fetchAll",
  async ({ startDate, endDate }, thunkAPI) => {
    try {
      const user = localStorage.getItem("user");
      if (user !== null) {
        const jsonData = JSON.parse(user);
        const userId = jsonData.data._id;
        const data = await transactionRepository.getAll({
          userId: userId,
          startDate,
          endDate,
        });
        return data.data;    
      } else {
        return thunkAPI.rejectWithValue("Usuario no autenticado");
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    fetchTransactionsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTransactionsSuccess(state, action) {
      state.loading = false;
      state.transactions = action.payload;
    },
    fetchTransactionsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    addTransaction(state, action) {
      state.transactions.push(action.payload);
    },
    updateTransaction(state, action) {
      const index = state.transactions.findIndex(
        (t) => t.id === action.payload.id
      );
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    },
    deleteTransaction(state, action) {
      state.transactions = state.transactions.filter(
        (t) => t.id !== action.payload
      );
    },
  },
});

export const {
  fetchTransactionsStart,
  fetchTransactionsSuccess,
  fetchTransactionsFailure,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} = transactionSlice.actions;

export default transactionSlice.reducer;
