import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";

const categoryRepository = {
  getAll: async (filter) => {
    return await getCategories(filter);
  },
  getById: async (id) => {
    return await getCategoryById(id);
  },
  create: async (data) => {
    return await createCategory(data);
  },
  update: async (id, data) => {
    return await updateCategory(id, data);
  },
  delete: async (id) => {
    return await deleteCategory(id);
  },
};

export default categoryRepository;
