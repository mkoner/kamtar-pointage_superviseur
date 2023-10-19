import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import commentService from "./commentService";


const initialState = {
    comments: [],
    selectedComment: {},
    isCommentsError: false,
    isCommentsSuccess: false,
    isCommentsLoading: false,
    commentsMessage: "",
    commentCreated: false,
  };
  
  // Create comment
  export const createComment = createAsyncThunk(
    "comments/createComment",
    async (comment, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.loggedInUser.token;
        return await commentService.createComment(comment, token);
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
  
  // Get comments by mission
  export const getCommentsByMission = createAsyncThunk(
    "comments/getCommentsByMission",
    async (mission, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.loggedInUser.token;
        return await commentService.getCommentsByMission(mission, token);
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


  // Get comments by id
  export const getCommentById = createAsyncThunk(
    "comments/getCommentById",
    async (id, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.loggedInUser.token;
        return await commentService.getCommentsById(id, token);
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
  
  // respond to a comment
  export const respondToComment = createAsyncThunk(
    "comments/respondToComment",
    async (data, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.loggedInUser.token;
        return await commentService.respondToComment(data, token);
      } catch (error) {
        console.log(error)
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
  
  // delete a comment
  export const deleteComment = createAsyncThunk(
    "comments/deleteComment",
    async (id, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.loggedInUser.token;
        return await commentService.deleteComment(id, token);
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
  

  export const commentSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {
      resetComments: (state) => {
        state.isCommentsLoading = false;
        state.isCommentsSuccess = false;
        state.isCommentsError = false;
        state.commentsMessage = "";
        state.commentCreated = false;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(createComment.pending, (state) => {
          state.isCommentsLoading = true;
        })
        .addCase(createComment.fulfilled, (state, action) => {
          state.isCommentsLoading = false;
          state.isCommentsSuccess = true;
          state.commentCreated = true;
        })
        .addCase(createComment.rejected, (state, action) => {
          state.isCommentsLoading = false;
          state.isCommentsError = true;
          state.commentsMessage = action.payload;
        })
        .addCase(getCommentsByMission.pending, (state) => {
          state.isCommentsLoading = true;
        })
        .addCase(getCommentsByMission.fulfilled, (state, action) => {
          state.isCommentsLoading = false;
          state.isCommentsSuccess = true;
          state.comments = action.payload;
        })
        .addCase(getCommentsByMission.rejected, (state, action) => {
          state.isCommentsLoading = false;
          state.isCommentsError = true;
          state.commentsMessage = action.payload;
        })
        .addCase(respondToComment.pending, (state) => {
            state.isCommentsLoading = true;
          })
          .addCase(respondToComment.fulfilled, (state, action) => {
            state.isCommentsLoading = false;
            state.isCommentsSuccess = true;
          })
          .addCase(respondToComment.rejected, (state, action) => {
            state.isCommentsLoading = false;
            state.isCommentsError = true;
            state.commentsMessage = action.payload;
          })
          .addCase(getCommentById.pending, (state) => {
              state.isCommentsLoading = true;
            })
            .addCase(getCommentById.fulfilled, (state, action) => {
              state.isCommentsLoading = false;
                state.isCommentsSuccess = true;
                state.selectedComment = action.payload
            })
            .addCase(getCommentById.rejected, (state, action) => {
              state.isCommentsLoading = false;
              state.isCommentsError = true;
              state.commentsMessage = action.payload;
            })
            .addCase(deleteComment.pending, (state) => {
              state.isCommentsLoading = true;
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
              state.isCommentsLoading = false;
                state.isCommentsSuccess = true;
                state.commentsMessage = action.payload
            })
            .addCase(deleteComment.rejected, (state, action) => {
              state.isCommentsLoading = false;
              state.isCommentsError = true;
              state.commentsMessage = action.payload;
            })
        
    },
  });
  
  export const { resetComments } = commentSlice.actions;
  export default commentSlice.reducer;