import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../urls";

const initialState = {
  permissions: {},
  isLoading: false,
  error: null,
};

export const fetchUserPermissions = createAsyncThunk(
  "userPermissions/fetchUserPermissions",
  async () => {
    try {
      const response = await fetch(`${baseUrl}/api/v1/permission/by-admin`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("CIP_Token")}`, // Replace with your CIP_Token storage method
        },
      });
      const data = await response.json();

      if (data.success === false) {
        // If permissions are undefined or success is false, remove GWP_Token and refresh page
        localStorage.removeItem("CIP_Token");
        localStorage.removeItem("user");
        console.error("Permissions not found or request failed! Token removed.");
        window.location.reload(); // Refresh the page
        return;
        }
      return data.permission;
    } catch (error) {
      throw error;
    }
  }
);

const userPermissionsSlice = createSlice({
  name: "userPermissions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPermissions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserPermissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.permissions = action.payload;
        // console.log("Fetched permissions:", action.payload); // Log the fetched permissions
      })
      .addCase(fetchUserPermissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        console.error("Error fetching permissions:", action.error.message);
      });
  },
});

export default userPermissionsSlice.reducer;
export const userPermissionsActions = userPermissionsSlice.actions;
