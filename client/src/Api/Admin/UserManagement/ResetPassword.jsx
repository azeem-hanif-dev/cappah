import { passwordReset, passwordForget } from "../../../urls";

export const resetPassword = async (CIP_Token, newPassword) => {
  try {
    const response = await fetch(`${passwordReset}/${CIP_Token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: newPassword }),
    });

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw new Error(error.message || "Network or server error");
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await fetch(passwordForget, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw new Error(error.message || "Network or server error");
  }
};
