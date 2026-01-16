import axios from 'axios';
import { BASE_URL } from '../utils/constants';
const API_URL = '/api/dashboard';

export const getDashboardData = async () => {
    try {
        const user = localStorage.getItem('user');
        const parsedUser = JSON.parse(user);
        const token = parsedUser.token;
        // Puedes usar el token para autenticar la solicitud si es necesario

        const response = await fetch(BASE_URL + '/user/dashboard/'
            + parsedUser.data._id
        ); // Ajusta la URL según tu backend
        if (!response.ok) {
            throw new Error('Error al cargar los datos del dashboard');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        throw error;
    }
};