import { getHistoryData } from '../services/historyService';

/**
 * Repository for handling history data operations.
 */
const historyRepository = {
    /**
     * Fetches history data using the historyService.
     * @returns {Promise<any>} The history data.
     */
    async fetchHistory(filter) {
        try {
            const data = await getHistoryData(filter);
            return data;
        } catch (error) {
            throw error;
        }
    }
};

export default historyRepository;