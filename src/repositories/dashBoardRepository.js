import { getDashboardData } from '../services/dashboardService';

const dashBoardRepository = {
    getDashboardData: async () => {
        return await getDashboardData();
    },
};

export default dashBoardRepository;