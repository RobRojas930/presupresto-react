import { BASE_URL } from '../utils/constants';
import axios from 'axios';

export async function loginApi(email, password) {
    try {
        const response = await axios.post(`${BASE_URL}/user/login`, {
            email,
            password,
        }, { timeout: 10000 });
        return response.data;
    } catch (error) {
        throw error;
    }

}
