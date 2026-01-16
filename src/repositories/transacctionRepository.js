import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/transacctionService";

const transactionRepository = {
  getAll: async (filter) => {
    return await getTransactions(filter);
  },

  getById: async (id) => {
    return await getTransactionById(id);
  },

  create: async (transactionData) => {
    return await createTransaction(transactionData);
  },

  update: async (id, transactionData) => {
    return await updateTransaction(id, transactionData);
  },

  remove: async (id) => {
    return await deleteTransaction(id);
  },
};

export default transactionRepository;
