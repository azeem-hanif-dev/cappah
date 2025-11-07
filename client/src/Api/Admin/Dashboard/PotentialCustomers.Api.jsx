// apiService.js
import { getPotentialCustomers } from "../../../urls";

export const fetchPotentialCustomersService = async (CIP_Token) => {
  try {
    const response = await fetch(`${getPotentialCustomers}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CIP_Token}`,
      },
    });

    const json = await response.json();

    console.log("Your data is", json.data); // Corrected
    return json.data; // Corrected
  } catch (error) {
    console.error("Failed to fetch potential customers:", error);
    throw error;
  }
};
