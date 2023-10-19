import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import missionService from "./missionService";

const initialState = {
  missions: [],
  selectedMission: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Create mission
export const createMission = createAsyncThunk(
  "missions/create",
  async (mission, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.loggedInUser.token;
      return await missionService.createMission(mission, token);
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

// Get all missions
export const getAllMissions = createAsyncThunk(
  "missions/getAllMissions",
  async (_,thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.loggedInUser.token;
      return await missionService.getAllMissions(token);
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

// Get all missions by month
export const getAllMissionsByMonth = createAsyncThunk(
  "missions/getAllMissionsByMonth",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.loggedInUser.token;
      return await missionService.getAllMissionsByMonth(
        data.month,
        data.year,
        token
      );
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

// Get missions by Sup
export const getMissionsBySup = createAsyncThunk(
  "missions/getMissionsBySup",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.loggedInUser.token;
      return await missionService.getMissionsBySup(id, token);
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

// Get missions by Sup and Month
export const getMissionsBySupAndMonth = createAsyncThunk(
  "missions/getMissionsBySupAndMonth",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.loggedInUser.token;
      return await missionService.getAllMissions(
        data.id,
        data.month,
        data.year,
        token
      );
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

// Get mission by ID
export const getMissionById = createAsyncThunk(
  "missions/getMissionById",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.loggedInUser.token;
      return await missionService.getMissionById(id, token);
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

// Update mission
export const updateMission = createAsyncThunk(
  "missions/update",
  async ( mission, thunkAPI) => {
    try {
      const reqData = {
        nom_client: mission.client,
        code_operation: mission.codeOperation,
      }
      const token = thunkAPI.getState().auth.loggedInUser.token;
      return await missionService.updateMission(mission.id, reqData, token);
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

// Delete mission
export const deleteMission = createAsyncThunk(
  "missions/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.loggedInUser.token;
      return await missionService.deleteMission(id, token);
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

// Validate mission start/end date
export const validateDate = createAsyncThunk(
  "missions/validate",
  async (data, thunkAPI) => {
    try {
      const reqBody = {
        type: data.type,
        date: data.date,
      };
      const token = thunkAPI.getState().auth.loggedInUser.token;
      return await missionService.validateDate(data.id, reqBody, token);
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

// Set mission end date by superviseur
export const finMission = createAsyncThunk(
  "missions/fin",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.loggedInUser.token;
      return await missionService.finMission(id, token);
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

export const missionSlice = createSlice({
  name: "missions",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMission.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createMission.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(createMission.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllMissions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllMissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.missions = action.payload;
      })
      .addCase(getAllMissions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllMissionsByMonth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllMissionsByMonth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.missions = action.payload;
      })
      .addCase(getAllMissionsByMonth.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getMissionsBySup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMissionsBySup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.missions = action.payload;
      })
      .addCase(getMissionsBySup.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getMissionsBySupAndMonth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMissionsBySupAndMonth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.missions = action.payload;
      })
      .addCase(getMissionsBySupAndMonth.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getMissionById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMissionById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.selectedMission = action.payload;
      })
      .addCase(getMissionById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateMission.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateMission.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.selectedMission = action.payload;
      })
      .addCase(updateMission.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteMission.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteMission.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.missions = state.missions.filter(
          (mission) => mission.id != action.payload.id
        );
      })
      .addCase(deleteMission.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(validateDate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(validateDate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.selectedMission = action.payload;
      })
      .addCase(validateDate.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(finMission.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(finMission.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.selectedMission = action.payload;
      })
      .addCase(finMission.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = missionSlice.actions;
export default missionSlice.reducer;
