import { subscribe } from "../../urls";
export const postEmail = async (formData) => {
  try {
    const response = await fetch(`${subscribe}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify JSON format
      },
      body: JSON.stringify(formData), // Use dynamic formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Response Data:", data);
    return data; // Return the response if needed
  } catch (error) {
    console.error("Error occurred:", error);
  }
};
