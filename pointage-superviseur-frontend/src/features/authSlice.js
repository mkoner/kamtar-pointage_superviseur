import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

// Get user from localStorage
const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  loggedInUser: user ? user : null,
  users: [],
  selectedUser: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  created: false,
};

// Create user
export const createUser = createAsyncThunk(
  "auth/createUser",
  async (user, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.loggedInUser.token;
      return await authService.createUser(user, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user
export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {
    return await authService.login(user);
     
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Log out
export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});

// Get Users by Role
export const getUsersByRole = createAsyncThunk(
  "auth/getUsersByRole",
  async (role, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.loggedInUser.token;
      return await authService.getUsersByRole(role, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all Users
export const getAllUsers = createAsyncThunk(
  "auth/getAllUsers",
  async (thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.loggedInUser.token;
      return await authService.getAllUsers(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user by id
export const getUserById = createAsyncThunk(
  "auth/getUserById",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.loggedInUser.token;
      return await authService.getUserById(id, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user by id1
export const getUserById1 = createAsyncThunk(
  "auth/getUserById1",
  async (id, thunkAPI) => {
    try {
      return await authService.getUserById1(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update user
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (user, thunkAPI) => {
    try {
      const reqData = {
        nom:user.nom,
        prenom:user.prenom,
        email: user.email,
        type: user.type,
        numero: user.numero,
        numero2: user.numero2,
        password: user.password,
        is_active: user.is_active,
        residence: user.residence,
        role: user.role
      }
      const token = thunkAPI.getState().auth.loggedInUser.token;
      return await authService.updateUser(user.id, reqData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update user password
export const updateUserPassword = createAsyncThunk(
  "auth/updateUserPassword",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.loggedInUser.token;
      const reqData = {
        password: data.password
      }
      return await authService.updateUserPassword(data.id, reqData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);


// Delete user
export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.loggedInUser.token;
      return await authService.deleteUser(id, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
      state.created = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.created = true;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.loggedInUser = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.loggedInUser = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.loggedInUser = null;
      })
      .addCase(getUsersByRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsersByRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload;
      })
      .addCase(getUsersByRole.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.selectedUser = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getUserById1.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserById1.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.validePar = action.payload
      })
      .addCase(getUserById1.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.selectedUser = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateUserPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.selectedUser = action.payload;
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = state.users.filter(
          (user) => user.id != action.payload.id
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
