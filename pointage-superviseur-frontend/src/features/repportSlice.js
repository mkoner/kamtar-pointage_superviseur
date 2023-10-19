import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import repportService from "./repportService";

const now = new Date();
const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
const initialState = {
  data: [],
  supData: [],
  selectedUser: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  pdf: null,
  filterDates: [firstDay, lastDay],
};

// Set filter dates
export const setFilterDates = createAsyncThunk(
  "repports/setDates",
  async (data, thunkAPI) => {
    try {
      return data;
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

// Get repports
export const getRepports = createAsyncThunk(
  "repports/getAll",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.loggedInUser.token;
      return await repportService.getRepport(data, token);
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

// Get repports by Sup
export const getRepportsBySup = createAsyncThunk(
  "repports/getBySup",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.loggedInUser.token;
      return await repportService.getRepportBySup(data, token);
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

// Get repports by Sup
export const getPDFData = createAsyncThunk(
  "repports/getPDFData",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.loggedInUser.token;
      return await repportService.getPDFData(data, token);
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

export const RepportSlice = createSlice({
  name: "repports",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRepports.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRepports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(getRepports.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getRepportsBySup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRepportsBySup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.supData = action.payload;
      })
      .addCase(getRepportsBySup.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(getPDFData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPDFData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.pdf = action.payload;
      })
      .addCase(getPDFData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(setFilterDates.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(setFilterDates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.filterDates = action.payload;
      })
      .addCase(setFilterDates.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = RepportSlice.actions;
export default RepportSlice.reducer;
