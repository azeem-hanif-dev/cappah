import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { userLogin } from "../../urls";

// Async thunk for login

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${userLogin}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }), // Send credentials
      });

      const data = await response.json(); // Parse JSON response

      if (response.ok) {
        // If login is successful, return the CIP_Token and user data
        return {
          CIP_Token: data.CIP_Token,
          message: data.message,
          user: data.data, // Include user data from the response
        };
      } else {
        // Handle error response from the server
        return rejectWithValue(data.message || "Login failed");
      }
    } catch (error) {
      // Handle network errors
      return rejectWithValue("Network error: " + error.message);
    }
  }
);

// Async thunk for register
export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${config.baseUrl}/api/v1/admin/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData), // Send the user data as a JSON string
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle non-200 status codes
        return rejectWithValue(result.message || "Registration failed");
      }

      // Return the CIP_Token and user data if successful
      return {
        CIP_Token: result.CIP_Token,
        user: result.data,
      };
    } catch (error) {
      // Handle any network or server errors
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// Initial state, check for existing CIP_Token and user data in localStorage
const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  CIP_Token: localStorage.getItem("CIP_Token") || null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("CIP_Token"), // If CIP_Token exists, set as authenticated
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false; // Set authentication status to false

      localStorage.removeItem("CIP_Token");
      localStorage.removeItem("user"); // Remove the entire user object from localStorage
    },
    setUserDataFromLocalStorage: (state) => {
      // This reducer updates the state with localStorage data on app load
      const CIP_Token = localStorage.getItem("CIP_Token");
      const user = localStorage.getItem("user");

      if (CIP_Token && user) {
        state.user = JSON.parse(user); // Parse the stored user object
        state.CIP_Token = CIP_Token;
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // Store user data in the state
        state.CIP_Token = action.payload.CIP_Token;
        state.isAuthenticated = true; // Set authentication status to true

        // Store CIP_Token and the entire user object in local storage
        localStorage.setItem("CIP_Token", action.payload.CIP_Token);
        localStorage.setItem("user", JSON.stringify(action.payload.user)); // Store the entire user object as a JSON string
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message on failed login
      })
      // Handle register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // Store user data in the state
        state.CIP_Token = action.payload.CIP_Token;
        state.isAuthenticated = true; // Set authentication status to true

        // Store CIP_Token and the entire user object in local storage
        localStorage.setItem("CIP_Token", action.payload.CIP_Token);
        localStorage.setItem("user", JSON.stringify(action.payload.user)); // Store the entire user object as a JSON string
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message on failed registration
      });
  },
});

export const { logout, setUserDataFromLocalStorage } = authSlice.actions;

export default authSlice.reducer;
