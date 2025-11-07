import { addEvent } from "../../../urls";

export const createEvent = async (formData, CIP_Token) => {
  // Retrieve and merge time fields
  const timeFrom = formData.get("timeFrom");
  const timeTo = formData.get("timeTo");

  if (timeFrom && timeTo) {
    const combinedTime = `${timeFrom}-${timeTo}`;
    formData.set("time", combinedTime);
    formData.delete("timeFrom");
    formData.delete("timeTo");
  }

  try {
    const response = await fetch(`${addEvent}`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${CIP_Token}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
