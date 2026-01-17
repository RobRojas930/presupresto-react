// src/services/historyService.js
import { BASE_URL } from "../utils/constants";

export async function getHistoryData({ userId, startDate, endDate }) {
  try {
    const response = await fetch(
      `${BASE_URL}/user/history/${userId}?startDate=${startDate}&endDate=${endDate}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Error fetching history data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("getHISTORYDATA error:", error);
    throw error;
  }
}
