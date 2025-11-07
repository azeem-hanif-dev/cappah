// src/api/headingApi.js
import { getHeading } from "../../../urls";
export const fetchHeadingApi = async () => {
    try {
      const response = await fetch(`${getHeading}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const json = await response.json();
      return json.data; // Return only the data part
    } catch (error) {
      throw new Error("Failed to fetch heading: " + error.message);
    }
  };
  