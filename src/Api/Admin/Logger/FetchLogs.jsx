// logService.js
import { logsApi } from "../../../urls";

export const fetchLogs = async (page, CIP_Token, LOGS_PER_PAGE) => {
  try {
    const response = await fetch(
      `${logsApi}?page=${page}&limit=${LOGS_PER_PAGE}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CIP_Token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    // Return data in a structured way
    return {
      data: json.data || [],
      totalPages: json.pagination.totalPages || 1,
      totalLogs: json.pagination.total || 0,
    };
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    // Return fallback data in case of error
    return {
      data: [],
      totalPages: 1,
      totalLogs: 0,
    };
  }
};
