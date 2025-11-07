import { eventsUrl } from "../../../urls";
export const getEventDetails = async () => {
  try {
    const response = await fetch(eventsUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch event details");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching event details:", error);
    return null;
  }
};
