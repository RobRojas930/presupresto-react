import {
  getBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget,
} from "../services/budgetService";

const budgetRepository = {
  async getBudgets(data) {
    return await getBudgets(data);
  },

  async getBudgetById(id) {
    return await getBudgetById(id);
  },

  async createBudget(budgetData) {
    return await createBudget(budgetData);
  },

  async updateBudget(id, budgetData) {
    return await updateBudget(id, budgetData);
  },

  async deleteBudget(id) {
    return await deleteBudget(id);
  },
};

export default budgetRepository;
