import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../reducers/authSlice";
import userPermissionsReducer from "../reducers/userRoleSlice";
// Import your categorySlice

export const store = configureStore({
	reducer: {
		auth: authReducer, // Handles authentication
		userPermissions: userPermissionsReducer,
	},
});
