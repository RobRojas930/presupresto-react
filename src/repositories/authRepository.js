import { loginApi } from '../services/authService';

const authRepository = {
    login: async (email, password) => {
        return await loginApi(email, password);
    },
    // logout: async () => {
    //     return await logoutApi();
    // },
    // register: async (userData) => {
    //     return await registerApi(userData);
    // },
    // getCurrentUser: () => {
    //     return getCurrentUser();
    // }
};

export default authRepository;